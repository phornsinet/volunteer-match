"use server";
import { supabase } from "@/lib/supabase";

interface AccountDetailsData {
  account_id: string; // Supabase user IDs are typically UUID strings
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
}



export async function getAccountDetails(accountId: string): Promise<AccountDetailsData | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('account_id')
      .eq('account_id', accountId)
      .single(); // Use .single() if you expect only one row

    if (error) {
      console.error("Supabase getAccountDetails error:", error);
      throw error;
    }

    return data as AccountDetailsData | null;
  } catch (error: any) {
    console.error("Error in getAccountDetails:", error);
    throw error;
  }
}

export async function updateAccountDetails(accountId: string, updates: Partial<AccountDetailsData>) {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ ...updates, account_id: accountId }, { onConflict: 'account_id' }); // Use upsert

    if (error) {
      console.error("Supabase updateAccountDetails error:", error);
      throw error;
    }
    console.log("Profile upserted successfully for account_id:", accountId);
  } catch (error: any) {
    console.error("Error in updateAccountDetails:", error);
    throw error;
  }
}