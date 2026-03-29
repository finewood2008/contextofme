DROP POLICY IF EXISTS "Public slices viewable via profile" ON public.slices;

CREATE POLICY "Public slices viewable for non-private vaults"
ON public.slices FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.public_profiles pp
    WHERE pp.user_id = slices.user_id
      AND pp.is_private = false
  )
);