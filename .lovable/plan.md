

## Problem

The `slices` table has a SELECT policy "Public slices viewable via profile" that subqueries the `profiles` table. But `profiles` has RLS restricting SELECT to `auth.uid() = user_id` only. So for anonymous visitors, the subquery returns zero rows and slices are invisible.

## Fix

One database migration to update the RLS policy on `slices`:

**Drop** the existing "Public slices viewable via profile" policy and **create** a replacement that queries `public_profiles` (the view already accessible to anon/authenticated) and checks `is_private = false`:

```sql
DROP POLICY "Public slices viewable via profile" ON public.slices;

CREATE POLICY "Public slices viewable for non-private vaults"
ON public.slices FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.public_profiles pp
    WHERE pp.user_id = slices.user_id
      AND pp.is_private = false
  )
);
```

The existing "Users can view their own slices" policy (`auth.uid() = user_id`) remains so logged-in owners always see their own slices regardless of privacy setting.

No frontend changes needed — `PublicProfile.tsx` already queries slices correctly; it just gets empty results due to the broken RLS.

