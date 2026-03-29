
-- Add X platform fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS x_api_key TEXT,
  ADD COLUMN IF NOT EXISTS x_api_secret TEXT,
  ADD COLUMN IF NOT EXISTS x_access_token TEXT,
  ADD COLUMN IF NOT EXISTS x_access_secret TEXT,
  ADD COLUMN IF NOT EXISTS x_auto_post BOOLEAN NOT NULL DEFAULT false;

-- Create x_posts table
CREATE TABLE IF NOT EXISTS public.x_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slice_id UUID NOT NULL REFERENCES public.slices(id) ON DELETE CASCADE,
  tweet_id TEXT,
  tweet_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  posted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.x_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own x_posts" ON public.x_posts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own x_posts" ON public.x_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own x_posts" ON public.x_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own x_posts" ON public.x_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_x_posts_user_id ON public.x_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_x_posts_slice_id ON public.x_posts(slice_id);
