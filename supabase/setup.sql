-- =============================================
-- Cult of Drive - Complete Database Setup
-- Run this file once in Supabase SQL Editor
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================
-- STEP 1: Core Tables
-- =============================================

-- Cars table
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model TEXT NOT NULL,
  year INT4,
  user_id UUID,
  image_url TEXT,
  description TEXT,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  view_count INT4 DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comments
CREATE TABLE IF NOT EXISTS public.car_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  user_id UUID,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (car_id, user_id)
);

-- Email subscriptions
CREATE TABLE IF NOT EXISTS public."E-mail" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  e_mail TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- STEP 2: User Profiles
-- =============================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name, slug)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    lower(regexp_replace(regexp_replace(trim(COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))), '\s+', '-', 'g'), '[^a-z0-9\-]', '', 'g'))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-generate slug on update
CREATE OR REPLACE FUNCTION public.generate_profile_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(regexp_replace(trim(NEW.display_name), '\s+', '-', 'g'), '[^a-z0-9\-]', '', 'g'));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_slug_generate ON public.user_profiles;
CREATE TRIGGER on_profile_slug_generate
  BEFORE INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.generate_profile_slug();

-- =============================================
-- STEP 3: Analytics & Features
-- =============================================

-- Car views
CREATE TABLE IF NOT EXISTS public.car_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Function to update view count
CREATE OR REPLACE FUNCTION public.update_car_view_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  UPDATE public.cars
  SET view_count = (
    SELECT count(*) FROM public.car_views WHERE car_id = NEW.car_id
  )
  WHERE id = NEW.car_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_car_view_count ON public.car_views;
CREATE TRIGGER trigger_update_car_view_count
  AFTER INSERT ON public.car_views
  FOR EACH ROW EXECUTE FUNCTION public.update_car_view_count();

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reports
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  reporter_id UUID,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- STEP 4: Foreign Keys & Constraints
-- =============================================

-- Add foreign keys to cars
ALTER TABLE public.cars DROP CONSTRAINT IF EXISTS cars_user_id_fkey;
ALTER TABLE public.cars ADD CONSTRAINT cars_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- Add foreign keys to comments
ALTER TABLE public.car_comments DROP CONSTRAINT IF EXISTS car_comments_user_id_fkey;
ALTER TABLE public.car_comments ADD CONSTRAINT car_comments_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- Add foreign keys to favorites
ALTER TABLE public.favorites DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;
ALTER TABLE public.favorites ADD CONSTRAINT favorites_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Add foreign keys to notifications
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- =============================================
-- STEP 5: Row Level Security (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."E-mail" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Cars policies
DROP POLICY IF EXISTS "Public read cars" ON public.cars;
CREATE POLICY "Public read cars" ON public.cars FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert cars" ON public.cars;
CREATE POLICY "Users can insert cars" ON public.cars FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own cars" ON public.cars;
CREATE POLICY "Users can update own cars" ON public.cars FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own cars" ON public.cars;
CREATE POLICY "Users can delete own cars" ON public.cars FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
DROP POLICY IF EXISTS "Public read comments" ON public.car_comments;
CREATE POLICY "Public read comments" ON public.car_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert comments" ON public.car_comments;
CREATE POLICY "Users can insert comments" ON public.car_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.car_comments;
CREATE POLICY "Users can delete own comments" ON public.car_comments FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies
DROP POLICY IF EXISTS "Public read favorites" ON public.favorites;
CREATE POLICY "Public read favorites" ON public.favorites FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage favorites" ON public.favorites;
CREATE POLICY "Users can manage favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- User profiles policies
DROP POLICY IF EXISTS "Public read profiles" ON public.user_profiles;
CREATE POLICY "Public read profiles" ON public.user_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- Car views policies
DROP POLICY IF EXISTS "Public read car views" ON public.car_views;
CREATE POLICY "Public read car views" ON public.car_views FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert car views" ON public.car_views;
CREATE POLICY "Anyone can insert car views" ON public.car_views FOR INSERT WITH CHECK (true);

-- Email subscriptions policies
DROP POLICY IF EXISTS "Anyone can subscribe" ON public."E-mail";
CREATE POLICY "Anyone can subscribe" ON public."E-mail" FOR INSERT WITH CHECK (true);

-- Notifications policies
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Reports policies
DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (true);

-- =============================================
-- STEP 6: Storage Setup
-- =============================================

-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read car images" ON storage.objects FOR SELECT USING (bucket_id = 'car-images');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'car-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'car-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE USING (bucket_id = 'car-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================
-- STEP 7: Indexes for Performance
-- =============================================

-- Cars indexes
CREATE INDEX IF NOT EXISTS idx_cars_user_id ON public.cars(user_id);
CREATE INDEX IF NOT EXISTS idx_cars_model ON public.cars(model);
CREATE INDEX IF NOT EXISTS idx_cars_year ON public.cars(year);
CREATE INDEX IF NOT EXISTS idx_cars_featured ON public.cars(is_featured);
CREATE INDEX IF NOT EXISTS idx_cars_created_at ON public.cars(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cars_tags ON public.cars USING GIN(tags);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_car_id ON public.car_comments(car_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.car_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.car_comments(created_at DESC);

-- Favorites indexes
CREATE INDEX IF NOT EXISTS idx_favorites_car_id ON public.favorites(car_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.user_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.user_profiles(display_name);

-- Car views indexes
CREATE INDEX IF NOT EXISTS idx_car_views_car_id ON public.car_views(car_id);
CREATE INDEX IF NOT EXISTS idx_car_views_viewed_at ON public.car_views(viewed_at DESC);

-- =============================================
-- STEP 8: Permissions & Realtime
-- =============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Enable realtime for live features
ALTER PUBLICATION supabase_realtime ADD TABLE public.car_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.favorites;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

SELECT 'Database setup complete! 🚗' as status;