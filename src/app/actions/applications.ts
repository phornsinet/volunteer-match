'use server'

import { createClient } from '../../../utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function submitApplication(opportunityId: string) {
  try {
    const supabase = await createClient(cookies())
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('User not authenticated')
    }
    
    console.log('Submitting application for user:', user.id, 'opportunity:', opportunityId)
    
    // Check if user has already applied
    const { data: existingApplication } = await supabase
      .from('volunteer_applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('opportunity_id', opportunityId)
      .single()
    
    if (existingApplication) {
      throw new Error('You have already applied for this opportunity')
    }
    
    // Create new application
    const { data, error } = await supabase
      .from('volunteer_applications')
      .insert([
        {
          user_id: user.id,
          opportunity_id: opportunityId,
          status: 'pending'
        }
      ])
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      throw new Error('Failed to submit application')
    }
    
    // Revalidate the page to refresh data
    revalidatePath('/find-opportunities')
    revalidatePath('/account-volunteer')
    revalidatePath('/account-organizer')
    
    return { success: true, application: data }
  } catch (error: unknown) {
    console.error('Error in submitApplication:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return { success: false, error: errorMessage }
  }
}
