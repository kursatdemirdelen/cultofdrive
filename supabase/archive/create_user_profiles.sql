-- =============================================
-- USER PROFILES TABLE
-- Single source of truth for user data
-- =============================================

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public read user_profiles" ON public.user_profiles;
CREATE POLICY "Public read user_profiles"
ON public.user_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
ON public.user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_display_name ON public.user_profiles(display_name);

-- =============================================
-- TRIGGER: Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- NOTE: Foreign keys and policies are in fix_orphan_comments.sql
-- Run that file after this one to add constraints
-- =============================================

-- =============================================
-- MIGRATE EXISTING DATA (Optional)
-- Run this if you have existing users
-- =============================================

-- Create profiles for existing auth users
INSERT INTO public.user_profiles (id, email, display_name)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;

-- Update cars.owner to match user_profiles.display_name
-- (Only if you want to sync existing data)
-- UPDATE public.cars c
-- SET owner = up.display_name
-- FROM public.user_profiles up
-- WHERE c.user_id = up.id AND c.owner IS NULL;
