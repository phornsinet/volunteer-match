"use server";
import { supabase } from "@/lib/supabase";

export interface AccountDetailsData {
  id: string; // Primary key in your profiles table
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  phone_number?: string;
  updated_at?: string;
}

export interface OpportunityData {
  id: string;
  title: string;
  organizer_name: string;
  location: string;
  duration: string;
  email: string;
  requirement: string;
  benefit: string;
  poster_url?: string | null;
  created_at: string;
  user_id: string; // Added to track who created the event
}

export interface ApplicationData {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  applied_at: string;
  updated_at?: string;
  // Joined data from opportunities table
  opportunity?: {
    title: string;
    organizer_name: string;
    location: string;
    duration: string;
    created_at: string;
  };
}

export interface OrganizerApplicationData {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  applied_at: string;
  updated_at?: string;
  // Joined data
  opportunity?: {
    id: string;
    title: string;
    organizer_name: string;
    location: string;
    duration: string;
    user_id: string;
  };
  profile?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string;
  };
}

// Interface for applications table data
export interface GeneralApplicationData {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  email: string;
  phone_number: string;
  why_apply: string;
  why_choose_you: string;
  experience: string;
  cv_url?: string | null;
  created_at: string;
  status?: 'pending' | 'approved' | 'rejected'; // We can add this field to track status
}

// Get account details
export async function getAccountDetails(accountId: string): Promise<AccountDetailsData | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, avatar_url, phone_number, updated_at")
      .eq("id", accountId)
      .limit(1);

    if (error) throw error;

    return data && data.length > 0 ? (data[0] as AccountDetailsData) : null;
  } catch (error: any) {
    console.error("Error in getAccountDetails:", error);
    throw error;
  }
}

// Update account details
export async function updateAccountDetails(accountId: string, updates: Partial<AccountDetailsData>) {
  try {
    const { error } = await supabase
      .from("profiles")
      .upsert({ ...updates, id: accountId }, { onConflict: "id" });

    if (error) throw error;

    console.log("Profile upserted successfully for id:", accountId);
  } catch (error: any) {
    console.error("Error in updateAccountDetails:", error);
    throw error;
  }
}

// Get opportunities created by the organizer
export async function getOrganizerOpportunities(organizerEmail: string): Promise<OpportunityData[]> {
  try {
    console.log("getOrganizerOpportunities called with email:", organizerEmail);
    
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("email", organizerEmail)
      .order("created_at", { ascending: false });

    console.log("Supabase query result:", { data, error });

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    console.log("Returning opportunities data:", data || []);
    return data || [];
  } catch (error: any) {
    console.error("Error in getOrganizerOpportunities:", error);
    throw error;
  }
}

// Get opportunities created by the organizer using user ID (recommended)
export async function getOrganizerOpportunitiesByUserId(userId: string): Promise<OpportunityData[]> {
  try {
    console.log("getOrganizerOpportunitiesByUserId called with userId:", userId);
    
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    console.log("Supabase query result by user_id:", { data, error });

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    console.log("Returning opportunities data by user_id:", data || []);
    return data || [];
  } catch (error: any) {
    console.error("Error in getOrganizerOpportunitiesByUserId:", error);
    throw error;
  }
}

// Debug function to see all opportunities in the database
export async function getAllOpportunities(): Promise<OpportunityData[]> {
  try {
    console.log("Fetching all opportunities for debugging...");
    
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("All opportunities in database:", { data, error });

    if (error) {
      console.error("Error fetching all opportunities:", error);
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error("Error in getAllOpportunities:", error);
    throw error;
  }
}

// Get applications submitted by a user
export async function getUserApplications(userId: string): Promise<ApplicationData[]> {
  try {
    console.log("getUserApplications called with userId:", userId);
    
    const { data, error } = await supabase
      .from("volunteer_applications")
      .select(`
        *,
        opportunity:opportunities!inner(
          title,
          organizer_name,
          location,
          duration,
          created_at
        )
      `)
      .eq("user_id", userId)
      .order("applied_at", { ascending: false });

    console.log("Applications query result:", { data, error });

    if (error) {
      console.error("Applications query error:", error);
      throw error;
    }

    console.log("Returning applications data:", data || []);
    return data || [];
  } catch (error: any) {
    console.error("Error in getUserApplications:", error);
    throw error;
  }
}

// Apply for an opportunity
export async function applyForOpportunity(userId: string, opportunityId: string): Promise<ApplicationData | null> {
  try {
    console.log("Applying for opportunity:", { userId, opportunityId });
    
    // Check if user has already applied
    const { data: existingApplication, error: checkError } = await supabase
      .from("volunteer_applications")
      .select("id")
      .eq("user_id", userId)
      .eq("opportunity_id", opportunityId)
      .single();

    console.log("Existing application check:", { existingApplication, checkError });

    if (existingApplication) {
      throw new Error("You have already applied for this opportunity");
    }

    console.log("Attempting to insert new application...");
    const { data, error } = await supabase
      .from("volunteer_applications")
      .insert([
        {
          user_id: userId,
          opportunity_id: opportunityId,
          status: 'pending'
        }
      ])
      .select()
      .single();

    console.log("Application creation result:", { data, error });

    if (error) {
      console.error("Error creating application:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Error in applyForOpportunity:", error);
    throw error;
  }
}
export async function createTestOpportunity(userEmail: string, userId: string): Promise<OpportunityData | null> {
  try {
    console.log("Creating test opportunity for email:", userEmail, "and userId:", userId);
    
    const { data, error } = await supabase
      .from("opportunities")
      .insert([
        {
          title: "Test Event - Community Cleanup",
          organizer_name: "Test Organizer",
          location: "Phnom Penh, Cambodia",
          duration: "2 hours",
          email: userEmail,
          requirement: "No experience required",
          benefit: "Community service certificate",
          poster_url: null,
          user_id: userId, // Add user_id to track who created it
        },
      ])
      .select()
      .single();

    console.log("Test opportunity creation result:", { data, error });

    if (error) {
      console.error("Error creating test opportunity:", error);
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Error in createTestOpportunity:", error);
    throw error;
  }
}

// Get applications for organizer's events
export async function getOrganizerApplications(organizerUserId: string): Promise<OrganizerApplicationData[]> {
  try {
    console.log("Fetching applications for organizer:", organizerUserId);
    
    // First get the organizer's opportunities
    const { data: opportunities, error: oppsError } = await supabase
      .from("opportunities")
      .select("id")
      .eq("user_id", organizerUserId);

    if (oppsError) {
      console.error("Error fetching organizer's opportunities:", oppsError);
      throw oppsError;
    }

    if (!opportunities || opportunities.length === 0) {
      console.log("No opportunities found for organizer");
      return [];
    }

    const opportunityIds = opportunities.map(opp => opp.id);

    // Then get applications for those opportunities
    const { data, error } = await supabase
      .from("volunteer_applications")
      .select(`
        id,
        user_id,
        opportunity_id,
        status,
        applied_at,
        updated_at
      `)
      .in("opportunity_id", opportunityIds)
      .order("applied_at", { ascending: false });

    console.log("Organizer applications query result:", { data, error });

    if (error) {
      console.error("Organizer applications query error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log("No applications found for organizer's opportunities");
      return [];
    }

    // Get opportunity details and profile details separately
    const { data: opportunityDetails, error: oppDetailsError } = await supabase
      .from("opportunities")
      .select("id, title, organizer_name, location, duration, user_id")
      .in("id", opportunityIds);

    if (oppDetailsError) {
      console.error("Error fetching opportunity details:", oppDetailsError);
      throw oppDetailsError;
    }

    const userIds = data.map(app => app.user_id);
    const { data: profileDetails, error: profileDetailsError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, avatar_url")
      .in("id", userIds);

    if (profileDetailsError) {
      console.error("Error fetching profile details:", profileDetailsError);
      throw profileDetailsError;
    }

    // Transform the data to match our interface
    const transformedData = data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      opportunity_id: item.opportunity_id,
      status: item.status,
      applied_at: item.applied_at,
      updated_at: item.updated_at,
      opportunity: opportunityDetails?.find(opp => opp.id === item.opportunity_id),
      profile: profileDetails?.find(profile => profile.id === item.user_id)
    }));

    console.log("Returning transformed organizer applications data:", transformedData);
    return transformedData;
  } catch (error: any) {
    console.error("Error in getOrganizerApplications:", error);
    throw error;
  }
}

// Update application status (for organizers)
export async function updateApplicationStatus(applicationId: string, status: string): Promise<boolean> {
  try {
    console.log("Updating application status:", { applicationId, status });
    
    const { error } = await supabase
      .from("volunteer_applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", applicationId);

    if (error) {
      console.error("Error updating application status:", error);
      throw error;
    }

    console.log("Application status updated successfully");
    return true;
  } catch (error: any) {
    console.error("Error in updateApplicationStatus:", error);
    throw error;
  }
}

// Get all general applications from applications table
export async function getAllGeneralApplications(): Promise<GeneralApplicationData[]> {
  try {
    console.log("Fetching all general applications...");
    
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("General applications query result:", { data, error });

    if (error) {
      console.error("General applications query error:", error);
      throw error;
    }

    console.log("Returning general applications data:", data || []);
    return data || [];
  } catch (error: any) {
    console.error("Error in getAllGeneralApplications:", error);
    throw error;
  }
}

// Update general application status (if you add status column to applications table)
export async function updateGeneralApplicationStatus(applicationId: string, status: string): Promise<boolean> {
  try {
    console.log("Updating general application status:", { applicationId, status });
    
    // Note: This assumes you have a status column in applications table
    // If not, you might want to create a separate table for application statuses
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId);

    console.log("General application status update result:", { error });

    if (error) {
      console.error("Error updating general application status:", error);
      throw error;
    }

    console.log("General application status updated successfully");
    return true;
  } catch (error: any) {
    console.error("Error in updateGeneralApplicationStatus:", error);
    throw error;
  }
}
