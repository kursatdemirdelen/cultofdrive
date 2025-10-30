-- Notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null, -- 'comment', 'favorite', 'reply'
  car_id uuid references public.cars(id) on delete cascade,
  actor_id uuid, -- who triggered the notification
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

-- Users can only read their own notifications
drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications"
on public.notifications for select
using (auth.uid() = user_id);

-- System can insert notifications
drop policy if exists "System insert notifications" on public.notifications;
create policy "System insert notifications"
on public.notifications for insert
with check (true);

-- Users can update their own notifications (mark as read)
drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications"
on public.notifications for update
using (auth.uid() = user_id);

-- Index for faster queries
create index if not exists idx_notifications_user_id_created_at 
on public.notifications (user_id, created_at desc);

create index if not exists idx_notifications_user_id_read 
on public.notifications (user_id, read);
