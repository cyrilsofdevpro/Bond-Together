-- Run this in the Supabase SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now()
);

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'rooms'
      and column_name = 'slug'
  ) then
    alter table public.rooms add column slug text;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'rooms'
      and column_name = 'title'
  ) then
    alter table public.rooms add column title text;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'rooms'
      and column_name = 'subtitle'
  ) then
    alter table public.rooms add column subtitle text;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and indexname = 'rooms_slug_key'
  ) then
    create unique index rooms_slug_key on public.rooms (slug);
  end if;
end $$;

create table if not exists public.messages (
  id bigserial primary key,
  room_id uuid not null references public.rooms(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  sent_at timestamptz default now()
);

alter table public.rooms enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Rooms are viewable by everyone" on public.rooms;
drop policy if exists "Authenticated users can insert messages" on public.messages;
drop policy if exists "Messages are viewable by everyone" on public.messages;

create policy "Rooms are viewable by everyone"
  on public.rooms
  for select
  using (true);

create policy "Messages are viewable by everyone"
  on public.messages
  for select
  using (true);

create policy "Authenticated users can insert messages"
  on public.messages
  for insert
  with check (auth.role() = 'authenticated');

insert into public.rooms (id, name, slug, title, subtitle)
values
  ('11111111-1111-1111-1111-111111111111', 'General Book Lounge', 'general', 'General Book Lounge', 'Daily discussions and community chatter'),
  ('22222222-2222-2222-2222-222222222222', 'Author Q&A', 'author', 'Author Q&A', 'Ask questions directly to featured writers'),
  ('33333333-3333-3333-3333-333333333333', 'Book Recommendations', 'recommendations', 'Book Recommendations', 'Share and discover new reads'),
  ('44444444-4444-4444-4444-444444444444', 'Event Planning', 'events', 'Event Planning', 'Coordinate upcoming club sessions and meetups')
on conflict (id) do nothing;
