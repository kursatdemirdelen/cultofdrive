-- Moderation status for cars
alter table public.cars add column if not exists moderation_status text default 'pending';
-- Status: 'pending', 'approved', 'rejected'

alter table public.cars add column if not exists moderation_notes text;
alter table public.cars add column if not exists moderated_at timestamptz;
alter table public.cars add column if not exists moderated_by uuid;

-- Index for moderation queries
create index if not exists idx_cars_moderation_status on public.cars (moderation_status);

-- Moderation for comments
alter table public.car_comments add column if not exists moderation_status text default 'approved';
alter table public.car_comments add column if not exists moderation_notes text;

-- Reported content table
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  content_type text not null, -- 'car', 'comment'
  content_id uuid not null,
  reporter_id uuid,
  reason text not null,
  description text,
  status text not null default 'pending', -- 'pending', 'reviewed', 'resolved'
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

-- Users can create reports
drop policy if exists "Users create reports" on public.reports;
create policy "Users create reports"
on public.reports for insert
with check (true);

-- Only admins can read reports (implement admin check in app)
drop policy if exists "Public read reports" on public.reports;
create policy "Public read reports"
on public.reports for select
using (true);

-- Index for reports
create index if not exists idx_reports_content_type_id on public.reports (content_type, content_id);
create index if not exists idx_reports_status on public.reports (status);
