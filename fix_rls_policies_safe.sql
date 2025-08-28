-- SQL Commands to Fix Row Level Security Policies for volunteer_applications table
-- This version safely handles existing policies by dropping them first
-- Run these commands in your Supabase SQL Editor

-- Step 1: Enable RLS on volunteer_applications table (if not already enabled)
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own applications" ON volunteer_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON volunteer_applications;
DROP POLICY IF EXISTS "Organizers can view applications for their events" ON volunteer_applications;
DROP POLICY IF EXISTS "Organizers can update application status" ON volunteer_applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON volunteer_applications;

-- Step 3: Create policy to allow users to insert their own applications
CREATE POLICY "Users can insert their own applications" ON volunteer_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Step 4: Create policy to allow users to view their own applications
CREATE POLICY "Users can view their own applications" ON volunteer_applications
  FOR SELECT USING (auth.uid() = user_id);

-- Step 5: Create policy to allow organizers to view applications for their events
CREATE POLICY "Organizers can view applications for their events" ON volunteer_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM opportunities 
      WHERE opportunities.id = volunteer_applications.opportunity_id 
      AND opportunities.user_id = auth.uid()
    )
  );

-- Step 6: Create policy to allow organizers to update application status
CREATE POLICY "Organizers can update application status" ON volunteer_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM opportunities 
      WHERE opportunities.id = volunteer_applications.opportunity_id 
      AND opportunities.user_id = auth.uid()
    )
  );

-- Step 7: Create policy to allow users to update their own applications
CREATE POLICY "Users can update their own applications" ON volunteer_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Step 8: Verify the policies were created successfully
-- You can run this query to see all policies on the table:
-- SELECT * FROM pg_policies WHERE tablename = 'volunteer_applications';

-- Optional: Grant necessary permissions (usually not needed with Supabase)
-- GRANT ALL ON volunteer_applications TO authenticated;
-- GRANT ALL ON opportunities TO authenticated;
-- GRANT ALL ON profiles TO authenticated;
