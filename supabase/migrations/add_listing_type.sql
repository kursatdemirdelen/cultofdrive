-- Add listing_type and image_url columns to marketplace_listings table
-- This migration adds support for both car and part listings with images

-- Add the listing_type column with default value 'car'
ALTER TABLE public.marketplace_listings 
ADD COLUMN IF NOT EXISTS listing_type text NOT NULL DEFAULT 'car';

-- Add image_url column for listing images
ALTER TABLE public.marketplace_listings 
ADD COLUMN IF NOT EXISTS image_url text;

-- Add check constraint to ensure only 'car' or 'part' values
ALTER TABLE public.marketplace_listings 
ADD CONSTRAINT listing_type_check CHECK (listing_type IN ('car', 'part'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_marketplace_listing_type 
ON public.marketplace_listings (listing_type);

-- Update existing records to have 'car' as listing_type (if any exist without it)
UPDATE public.marketplace_listings 
SET listing_type = 'car' 
WHERE listing_type IS NULL;
