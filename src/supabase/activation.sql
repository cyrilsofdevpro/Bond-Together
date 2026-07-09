-- Run this in the Supabase SQL editor to create activation code tables, policies, and RPCs.

create extension if not exists "pgcrypto";

create table if not exists public.activation_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  plan_key text not null,
  duration interval not null default '30 days',
  used boolean not null default false,
  used_by uuid references auth.users(id) on delete set null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.user_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_key text not null,
  activation_code_id uuid references public.activation_codes(id),
  activated_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);


-- Create or update user profile on signup if missing.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, username, bio)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    lower(replace(coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)), ' ', '_')),
    ''
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

BEGIN;
-- Acquire DDL locks in a stable order to avoid deadlock when updating policies and triggers.
lock table public.activation_codes,
           public.user_memberships,
           auth.users
           in access exclusive mode;

alter table public.activation_codes enable row level security;
alter table public.user_memberships enable row level security;

-- Helper to determine whether current authenticated user is an admin.
drop function if exists public.is_admin_user();
create function public.is_admin_user()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_admin boolean := false;
begin
  if auth.jwt() ->> 'role' = 'admin'
     or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' then
    return true;
  end if;

  begin
    select is_admin into v_is_admin
    from public.profiles
    where user_id = auth.uid()
    limit 1;
  exception when undefined_column then
    return false;
  when others then
    return false;
  end;

  return coalesce(v_is_admin, false);
end;
$$;

-- Allow users to read and create only their own membership records.
drop policy if exists "Users can view own memberships" on public.user_memberships;
create policy "Users can view own memberships"
  on public.user_memberships
  for select
  using (auth.uid() = user_id);

 drop policy if exists "Users can insert own membership" on public.user_memberships;
create policy "Users can insert own membership"
  on public.user_memberships
  for insert
  with check (auth.uid() = user_id);

 drop policy if exists "Admin can manage memberships" on public.user_memberships;
create policy "Admin can manage memberships"
  on public.user_memberships
  for all
  using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    or auth.role() = 'service_role'
    or public.is_admin_user()
  )
  with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    or auth.role() = 'service_role'
    or public.is_admin_user()
  );

COMMIT;

-- Prevent normal users from reading activation codes directly.
drop policy if exists "Admin can manage activation codes" on public.activation_codes;
create policy "Admin can manage activation codes"
  on public.activation_codes
  for all
  using (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    or auth.role() = 'service_role'
    or public.is_admin_user()
  )
  with check (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    or auth.role() = 'service_role'
    or public.is_admin_user()
  );

-- Generate activation codes via RPC. Calls must be made by an admin user or service-role session.
drop function if exists public.generate_activation_codes(text, int, interval);
create function public.generate_activation_codes(
  p_plan text,
  p_count int,
  p_duration interval default '30 days'
)
returns table (id uuid, code text, plan_key text, duration interval, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.jwt() -> 'app_metadata' ->> 'role' <> 'admin'
     and auth.role() <> 'service_role'
     and not public.is_admin_user() then
    raise exception 'not_authorized';
  end if;

  return query
  insert into public.activation_codes (code, plan_key, duration)
  select
    upper(substring(md5(gen_random_uuid()::text) from 1 for 12)),
    p_plan,
    p_duration
  from generate_series(1, p_count)
  returning public.activation_codes.id, public.activation_codes.code, public.activation_codes.plan_key, public.activation_codes.duration, public.activation_codes.created_at;
end;
$$;

-- Redeem an activation code directly from the client using user auth.
drop function if exists public.redeem_activation_code(text);
create function public.redeem_activation_code(p_code text)
returns table (
  id uuid,
  user_id uuid,
  plan_key text,
  activation_code_id uuid,
  activated_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_code record;
  v_expires timestamptz;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  select * into v_code
  from public.activation_codes
  where code = upper(trim(p_code))
  for update;

  if not found then
    raise exception 'invalid_activation_code';
  end if;

  if v_code.used then
    raise exception 'activation_code_already_used';
  end if;

  v_expires := now() + v_code.duration;

  with inserted as (
    insert into public.user_memberships (user_id, plan_key, activation_code_id, activated_at, expires_at)
    values (v_user, v_code.plan_key, v_code.id, now(), v_expires)
    returning id, user_id, plan_key, activation_code_id, activated_at, expires_at, created_at
  )
  update public.activation_codes
  set used = true,
      used_by = v_user,
      used_at = now()
  where public.activation_codes.id = v_code.id;

  -- Explicitly select inserted columns to avoid ambiguous column references
  return query
  select
    inserted.id,
    inserted.user_id,
    inserted.plan_key,
    inserted.activation_code_id,
    inserted.activated_at,
    inserted.expires_at,
    inserted.created_at
  from inserted;
end;
$$;

-- Return the current user's active membership record, if any.
drop function if exists public.get_my_active_membership();
create function public.get_my_active_membership()
returns table (
  id uuid,
  user_id uuid,
  plan_key text,
  activation_code_id uuid,
  activated_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select id, user_id, plan_key, activation_code_id, activated_at, expires_at, created_at
  from public.user_memberships
  where user_id = auth.uid()
    and expires_at >= now()
  order by activated_at desc
  limit 1;
end;
$$;

-- Admin helper RPCs
create or replace function public.admin_list_activation_codes(p_limit int default 100)
returns table (id uuid, code text, plan_key text, duration interval, used boolean, used_by uuid, used_at timestamptz, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.jwt() -> 'app_metadata' ->> 'role' <> 'admin'
     and auth.role() <> 'service_role'
     and not public.is_admin_user() then
    raise exception 'not_authorized';
  end if;

  return query
  select id, code, plan_key, duration, used, used_by, used_at, created_at
  from public.activation_codes
  order by created_at desc
  limit p_limit;
end;
$$;

drop function if exists public.admin_mark_code_used(text);
create function public.admin_mark_code_used(p_code text)
returns table (id uuid, code text, plan_key text, used boolean, used_by uuid, used_at timestamptz, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.jwt() -> 'app_metadata' ->> 'role' <> 'admin'
     and auth.role() <> 'service_role'
     and not public.is_admin_user() then
    raise exception 'not_authorized';
  end if;

  return query
  update public.activation_codes
  set used = true,
      used_at = now()
  where code = upper(trim(p_code))
  returning id, code, plan_key, used, used_by, used_at, created_at;
end;
$$;
