DROP POLICY IF EXISTS "Public slices viewable for non-private vaults" ON public.slices;

DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles AS
  SELECT user_id, username, is_private
  FROM profiles
  WHERE username IS NOT NULL;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

CREATE POLICY "Public slices viewable for non-private vaults"
ON public.slices FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.public_profiles pp
    WHERE pp.user_id = slices.user_id
      AND pp.is_private = false
  )
);