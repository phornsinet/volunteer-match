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
