
CREATE POLICY "Users can delete their own slices"
ON public.slices
FOR DELETE
TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own slices"
ON public.slices
FOR UPDATE
TO public
USING (auth.uid() = user_id);
