-- =============================================
-- CLEANUP: Remove redundant columns and tables
-- =============================================

-- 1. Remove owner column from cars (now using user_profiles join)
ALTER TABLE public.cars DROP COLUMN IF EXISTS owner;

-- 2. Remove car_likes table (use favorites instead)
DROP TABLE IF EXISTS public.car_likes CASCADE;

-- 3. Update indexes
DROP INDEX IF EXISTS idx_cars_owner;

-- 4. Ensure display_name is NOT NULL in user_profiles
ALTER TABLE public.user_profiles ALTER COLUMN display_name SET NOT NULL;

-- 5. Ensure slug is NOT NULL in user_profiles
ALTER TABLE public.user_profiles ALTER COLUMN slug SET NOT NULL;
