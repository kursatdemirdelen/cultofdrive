-- Analytics table for tracking views and interactions
create table if not exists public.car_views (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars(id) on delete cascade,
  user_id uuid,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.car_views enable row level security;

-- Public can insert views
drop policy if exists "Public insert car_views" on public.car_views;
create policy "Public insert car_views"
on public.car_views for insert
with check (true);

-- Public can read aggregated view counts
drop policy if exists "Public read car_views" on public.car_views;
create policy "Public read car_views"
on public.car_views for select
using (true);

-- Indexes for analytics queries
create index if not exists idx_car_views_car_id on public.car_views (car_id);
create index if not exists idx_car_views_created_at on public.car_views (created_at desc);
create index if not exists idx_car_views_car_id_created_at on public.car_views (car_id, created_at desc);

-- Add view_count to cars table for caching
alter table public.cars add column if not exists view_count int4 default 0;

-- Function to update view count
create or replace function update_car_view_count()
returns trigger as $$
begin
  update public.cars
  set view_count = (
    select count(*) from public.car_views where car_id = NEW.car_id
  )
  where id = NEW.car_id;
  return NEW;
end;
$$ language plpgsql;

-- Trigger to update view count on new view
drop trigger if exists trigger_update_car_view_count on public.car_views;
create trigger trigger_update_car_view_count
after insert on public.car_views
for each row
execute function update_car_view_count();
