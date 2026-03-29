-- Drop the leaky public policy
DROP POLICY IF EXISTS "Public profiles viewable by username" ON public.profiles;

-- Create a safe public view exposing only non-sensitive columns
CREATE VIEW public.public_profiles AS
  SELECT user_id, username, is_private
  FROM public.profiles
  WHERE username IS NOT NULL;

-- Grant read access on the view to anon and authenticated
GRANT SELECT ON public.public_profiles TO anon, authenticated;