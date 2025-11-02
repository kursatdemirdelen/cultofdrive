-- =============================================
-- FIX ORPHAN COMMENTS
-- Clean up comments with invalid user_ids before adding foreign key
-- =============================================

-- Step 1: Create user_profiles for existing auth users (if not exists)
INSERT INTO public.user_profiles (id, email, display_name)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Set user_id to NULL for comments with non-existent users
UPDATE public.car_comments
SET user_id = NULL
WHERE user_id IS NOT NULL 
  AND user_id NOT IN (SELECT id FROM public.user_profiles);

-- Step 3: Now add the foreign key constraint
DO $$ 
BEGIN
  -- Drop existing constraint if exists
  ALTER TABLE public.car_comments DROP CONSTRAINT IF EXISTS car_comments_user_id_fkey;
  
  -- Add new constraint
  ALTER TABLE public.car_comments 
  ADD CONSTRAINT car_comments_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE SET NULL;
END $$;

-- Step 4: Add foreign keys to other tables
DO $$ 
BEGIN
  -- Favorites
  ALTER TABLE public.favorites DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;
  
  -- Clean orphan favorites
  DELETE FROM public.favorites
  WHERE user_id NOT IN (SELECT id FROM public.user_profiles);
  
  ALTER TABLE public.favorites 
  ADD CONSTRAINT favorites_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;
  
  -- Cars
  ALTER TABLE public.cars DROP CONSTRAINT IF EXISTS cars_user_id_fkey;
  
  -- Set NULL for orphan cars
  UPDATE public.cars
  SET user_id = NULL
  WHERE user_id IS NOT NULL 
    AND user_id NOT IN (SELECT id FROM public.user_profiles);
  
  ALTER TABLE public.cars 
  ADD CONSTRAINT cars_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE SET NULL;
END $$;

-- Step 5: Add delete policies
DROP POLICY IF EXISTS "Users can delete own comments" ON public.car_comments;
CREATE POLICY "Users can delete own comments"
ON public.car_comments FOR DELETE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;
CREATE POLICY "Users can delete own favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cars" ON public.cars;
CREATE POLICY "Users can update own cars"
ON public.cars FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own cars" ON public.cars;
CREATE POLICY "Users can delete own cars"
ON public.cars FOR DELETE
USING (auth.uid() = user_id);
