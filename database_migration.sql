-- Migration to add user tracking to opportunities table

-- Add user_id column to track who created the event
ALTER TABLE public.opportunities 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX idx_opportunities_user_id ON public.opportunities(user_id);

-- Optional: Add a constraint to ensure user_id is not null for new records
-- You can run this after updating your application code
-- ALTER TABLE public.opportunities ALTER COLUMN user_id SET NOT NULL;

-- Optional: If you want to add a foreign key to profiles table instead of auth.users
-- ALTER TABLE public.opportunities 
-- ADD COLUMN user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;
