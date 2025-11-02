-- Supabase schema for Driver's Garage

-- Ensure required extension for gen_random_uuid()
create extension if not exists pgcrypto;

-- cars table stores the main vehicle entries
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  model text not null,
  year int4,
  owner text,
  image_url text,
  description text,
  specs jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  is_featured boolean default false,
  created_at timestamptz not null default now()
);

alter table public.cars enable row level security;

-- Associate cars with the submitting user when available
alter table public.cars add column if not exists user_id uuid;

-- Public can read car entries
drop policy if exists "Public read cars" on public.cars;
create policy "Public read cars"
on public.cars for select using (true);

-- Allow anonymous inserts (adjust to 'authenticated' after adding auth)
drop policy if exists "Anonymous insert cars" on public.cars;
create policy "Anonymous insert cars"
on public.cars for insert with check (true);

-- Optional: additional tables for future features

-- Multiple images per car
create table if not exists public.car_images (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars(id) on delete cascade,
  path text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.car_images enable row level security;
drop policy if exists "Public read car_images" on public.car_images;
create policy "Public read car_images"
on public.car_images for select using (true);

-- Likes
create table if not exists public.car_likes (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars(id) on delete cascade,
  user_id uuid not null,
  created_at timestamptz not null default now(),
  unique (car_id, user_id)
);

alter table public.car_likes enable row level security;
drop policy if exists "Public read car_likes" on public.car_likes;
create policy "Public read car_likes" on public.car_likes for select using (true);
-- After auth, prefer: with check (auth.role() = 'authenticated')
drop policy if exists "Anonymous insert car_likes" on public.car_likes;
create policy "Anonymous insert car_likes" on public.car_likes for insert with check (true);
drop policy if exists "Anonymous delete car_likes" on public.car_likes;
create policy "Anonymous delete car_likes" on public.car_likes for delete using (true);

-- Comments
create table if not exists public.car_comments (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars(id) on delete cascade,
  user_id uuid,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.car_comments enable row level security;
drop policy if exists "Public read car_comments" on public.car_comments;
create policy "Public read car_comments" on public.car_comments for select using (true);
drop policy if exists "Anonymous insert car_comments" on public.car_comments;
create policy "Anonymous insert car_comments" on public.car_comments for insert with check (true);

-- Favorites
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars(id) on delete cascade,
  user_id uuid not null,
  created_at timestamptz not null default now(),
  unique (car_id, user_id)
);

alter table public.favorites enable row level security;
drop policy if exists "Public read favorites" on public.favorites;
create policy "Public read favorites" on public.favorites for select using (true);
drop policy if exists "Anonymous insert favorites" on public.favorites;
create policy "Anonymous insert favorites" on public.favorites for insert with check (true);
drop policy if exists "Anonymous delete favorites" on public.favorites;
create policy "Anonymous delete favorites" on public.favorites for delete using (true);

-- =============================================
-- Storage: 'garage' bucket for car images
-- =============================================
-- Create a public bucket to host uploaded images
insert into storage.buckets (id, name, public)
values ('garage', 'garage', true)
on conflict (id) do nothing;

-- Allow public reads for objects in the 'garage' bucket
drop policy if exists "Public read garage objects" on storage.objects;
create policy "Public read garage objects"
on storage.objects for select
using (bucket_id = 'garage');

-- Allow anonymous uploads into the 'garage' bucket
drop policy if exists "Public upload garage" on storage.objects;
create policy "Public upload garage"
on storage.objects for insert
with check (bucket_id = 'garage');

-- =============================================
-- Social posts (for curated feed)
-- =============================================
create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  content text not null,
  image_url text,
  like_count int4 not null default 0,
  url text,
  created_at timestamptz not null default now()
);

alter table public.social_posts enable row level security;
drop policy if exists "Public read social_posts" on public.social_posts;
create policy "Public read social_posts" on public.social_posts for select using (true);
drop policy if exists "Anonymous insert social_posts" on public.social_posts;
create policy "Anonymous insert social_posts" on public.social_posts for insert with check (true);

-- =============================================
-- Waitlist emails
-- Table name uses hyphen to match app code: "E-mail"
-- =============================================
create table if not exists public."E-mail" (
  id uuid primary key default gen_random_uuid(),
  e_mail text not null unique,
  created_at timestamptz not null default now()
);

alter table public."E-mail" enable row level security;
-- Allow anonymous inserts; no public read policy to keep emails private
drop policy if exists "Anonymous insert E-mail" on public."E-mail";
create policy "Anonymous insert E-mail" on public."E-mail" for insert with check (true);

-- =============================================
-- Helpful indexes for query patterns
-- =============================================
-- Cars
create index if not exists idx_cars_created_at on public.cars (created_at desc);
create index if not exists idx_cars_owner on public.cars (owner);
create index if not exists idx_cars_user_id on public.cars (user_id);
-- Handle tags index across differing existing schemas (text[] vs json/jsonb)
do $$
declare
  v_data_type text;
begin
  select data_type into v_data_type
  from information_schema.columns
  where table_schema = 'public' and table_name = 'cars' and column_name = 'tags';

  -- If an older schema has tags as json, convert to jsonb first
  if v_data_type = 'json' then
    execute 'alter table public.cars alter column tags type jsonb using tags::jsonb';
    v_data_type := 'jsonb';
  end if;

  -- Create the best-suited GIN index
  if v_data_type = 'ARRAY' then
    -- text[] default
    execute 'create index if not exists idx_cars_tags on public.cars using gin (tags)';
  elsif v_data_type = 'jsonb' then
    execute 'create index if not exists idx_cars_tags_jsonb on public.cars using gin (tags jsonb_path_ops)';
  else
    -- Fallback: try array index (will no-op if incompatible)
    begin
      execute 'create index if not exists idx_cars_tags on public.cars using gin (tags)';
    exception when others then
      null;
    end;
  end if;
end $$ language plpgsql;

-- Car images
create index if not exists idx_car_images_car_id on public.car_images (car_id);

-- Likes, favorites, comments
create index if not exists idx_car_likes_car_id on public.car_likes (car_id);
create index if not exists idx_favorites_car_id on public.favorites (car_id);
create index if not exists idx_car_comments_car_id_created_at on public.car_comments (car_id, created_at desc);

-- Social posts
create index if not exists idx_social_posts_created_at on public.social_posts (created_at desc);

