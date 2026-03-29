-- Add X platform configuration to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS x_api_key TEXT,
ADD COLUMN IF NOT EXISTS x_api_secret TEXT,
ADD COLUMN IF NOT EXISTS x_access_token TEXT,
ADD COLUMN IF NOT EXISTS x_access_secret TEXT,
ADD COLUMN IF NOT EXISTS x_auto_post BOOLEAN DEFAULT false;

-- Add X platform post tracking
CREATE TABLE IF NOT EXISTS public.x_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slice_id UUID NOT NULL REFERENCES public.slices(id) ON DELETE CASCADE,
  tweet_id TEXT,
  tweet_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, posted, failed
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  posted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.x_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for x_posts
CREATE POLICY "Users can view their own X posts"
  ON public.x_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own X posts"
  ON public.x_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own X posts"
  ON public.x_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own X posts"
  ON public.x_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_x_posts_user_id ON public.x_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_x_posts_slice_id ON public.x_posts(slice_id);
