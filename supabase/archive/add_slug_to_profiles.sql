-- Add slug column to user_profiles
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS slug text;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_slug ON public.user_profiles(slug);

-- Generate slugs for existing users
UPDATE public.user_profiles
SET slug = lower(regexp_replace(regexp_replace(trim(display_name), '\s+', '-', 'g'), '[^a-z0-9\-]', '', 'g'))
WHERE slug IS NULL;

-- Update trigger to auto-generate slug
CREATE OR REPLACE FUNCTION public.generate_profile_slug()
RETURNS trigger AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(regexp_replace(trim(NEW.display_name), '\s+', '-', 'g'), '[^a-z0-9\-]', '', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_slug_generate ON public.user_profiles;
CREATE TRIGGER on_profile_slug_generate
  BEFORE INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.generate_profile_slug();
