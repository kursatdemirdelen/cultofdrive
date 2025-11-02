-- Marketplace listings
create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  listing_type text not null default 'car', -- 'car' or 'part'
  car_id uuid references public.cars(id) on delete cascade,
  seller_id uuid not null,
  title text not null,
  description text not null,
  image_url text,
  price numeric(10, 2),
  currency text default 'USD',
  location text,
  status text not null default 'active', -- 'active', 'sold', 'expired', 'removed'
  contact_email text,
  contact_phone text,
  views int4 default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz
);

alter table public.marketplace_listings enable row level security;

-- Public can read active listings
drop policy if exists "Public read active listings" on public.marketplace_listings;
create policy "Public read active listings"
on public.marketplace_listings for select
using (status = 'active' or seller_id = auth.uid());

-- Users can create their own listings
drop policy if exists "Users create listings" on public.marketplace_listings;
create policy "Users create listings"
on public.marketplace_listings for insert
with check (auth.uid() = seller_id);

-- Users can update their own listings
drop policy if exists "Users update own listings" on public.marketplace_listings;
create policy "Users update own listings"
on public.marketplace_listings for update
using (auth.uid() = seller_id);

-- Indexes
create index if not exists idx_marketplace_status on public.marketplace_listings (status);
create index if not exists idx_marketplace_listing_type on public.marketplace_listings (listing_type);
create index if not exists idx_marketplace_seller_id on public.marketplace_listings (seller_id);
create index if not exists idx_marketplace_created_at on public.marketplace_listings (created_at desc);
create index if not exists idx_marketplace_price on public.marketplace_listings (price);

-- Marketplace inquiries
create table if not exists public.marketplace_inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.marketplace_listings(id) on delete cascade,
  buyer_id uuid,
  message text not null,
  contact_info text,
  created_at timestamptz not null default now()
);

alter table public.marketplace_inquiries enable row level security;

-- Users can create inquiries
drop policy if exists "Users create inquiries" on public.marketplace_inquiries;
create policy "Users create inquiries"
on public.marketplace_inquiries for insert
with check (true);

-- Sellers can read inquiries for their listings
drop policy if exists "Sellers read inquiries" on public.marketplace_inquiries;
create policy "Sellers read inquiries"
on public.marketplace_inquiries for select
using (
  listing_id in (
    select id from public.marketplace_listings where seller_id = auth.uid()
  )
);

-- Index
create index if not exists idx_inquiries_listing_id on public.marketplace_inquiries (listing_id);
