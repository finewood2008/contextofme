
-- Create profiles table with api_token
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT UNIQUE,
  api_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public profiles viewable by username" ON public.profiles FOR SELECT USING (username IS NOT NULL);

-- Create slices table
CREATE TABLE public.slices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_text TEXT NOT NULL,
  purified_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.slices ENABLE ROW LEVEL SECURITY;

-- Slices policies
CREATE POLICY "Users can view their own slices" ON public.slices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own slices" ON public.slices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public slices viewable via profile" ON public.slices FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = slices.user_id AND profiles.username IS NOT NULL)
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to look up user by api_token (for edge function auth)
CREATE OR REPLACE FUNCTION public.get_user_by_api_token(token TEXT)
RETURNS TABLE(user_id UUID) AS $$
  SELECT profiles.user_id FROM public.profiles WHERE profiles.api_token = token;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;
