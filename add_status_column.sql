-- SQL to add status column to applications table
-- Run this in your Supabase SQL Editor

-- Add status column to applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- Add constraint to ensure only valid status values
ALTER TABLE public.applications 
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update existing records to have 'pending' status if they don't have one
UPDATE public.applications 
SET status = 'pending' 
WHERE status IS NULL;
