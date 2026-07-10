-- Fresh Supabase activation schema and RPCs
-- Run this in the Supabase SQL editor to replace your current activation-code setup.

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

alter table public.activation_codes enable row level security;
alter table public.user_memberships enable row level security;

create or replace function public.is_admin_user()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_admin boolean := false;
begin
  if auth.jwt() ->> 'role' = 'admin'
     or auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
     or auth.role() = 'service_role' then
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

drop function if exists public.generate_activation_codes(text, int, interval);
create function public.generate_activation_codes(
  p_plan text,
  p_count int,
  p_duration interval default '30 days'
)
returns table (
  id uuid,
  code text,
  plan_key text,
  duration interval,
  created_at timestamptz
)
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
  with inserted as (
    insert into public.activation_codes as ac (code, plan_key, duration)
    select
      upper(substring(md5(gen_random_uuid()::text) from 1 for 12)) as code,
      p_plan as plan_key,
      p_duration as duration
    from generate_series(1, p_count)
    returning
      ac.id as id,
      ac.code as code,
      ac.plan_key as plan_key,
      ac.duration as duration,
      ac.created_at as created_at
  )
  select
    inserted.id,
    inserted.code,
    inserted.plan_key,
    inserted.duration,
    inserted.created_at
  from inserted;
end;
$$;

drop function if exists public.redeem_activation_code(text);
create function public.redeem_activation_code(p_code text)
returns table (
  id uuid,
  user_id uuid,
  plan_key text,
  activation_code_id uuid,
  activated_at timestamptz,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_activation_code_id uuid;
  v_plan_key text;
  v_duration interval;
  v_used boolean;
  v_expires timestamptz;
  v_membership_id uuid;
  v_activated_at timestamptz;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  select
    ac.id,
    ac.plan_key,
    ac.duration,
    ac.used
  into v_activation_code_id, v_plan_key, v_duration, v_used
  from public.activation_codes as ac
  where ac.code = upper(trim(p_code))
  for update of ac;

  if not found then
    raise exception 'invalid_activation_code';
  end if;

  if v_used then
    raise exception 'activation_code_already_used';
  end if;

  v_expires := now() + v_duration;

  insert into public.user_memberships as um (user_id, plan_key, activation_code_id, activated_at, expires_at)
  values (v_user, v_plan_key, v_activation_code_id, now(), v_expires)
  returning
    um.id as id,
    um.activated_at as activated_at
  into v_membership_id, v_activated_at;

  update public.activation_codes as ac
  set used = true,
      used_by = v_user,
      used_at = now()
  where ac.id = v_activation_code_id;

  return query
  select
    v_membership_id as id,
    v_user as user_id,
    v_plan_key as plan_key,
    v_activation_code_id as activation_code_id,
    v_activated_at as activated_at,
    v_expires as expires_at;
end;
$$;

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
  select
    um.id,
    um.user_id,
    um.plan_key,
    um.activation_code_id,
    um.activated_at,
    um.expires_at,
    um.created_at
  from public.user_memberships as um
  where um.user_id = auth.uid()
    and um.expires_at >= now()
  order by um.activated_at desc
  limit 1;
end;
$$;

drop function if exists public.admin_get_users_with_memberships();
create function public.admin_get_users_with_memberships()
returns table (
  user_id uuid,
  email text,
  role text,
  created_at timestamptz,
  full_name text,
  username text,
  is_admin boolean,
  plan_key text,
  activated_at timestamptz,
  expires_at timestamptz
)
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
  select
    u.id as user_id,
    u.email,
    coalesce(u.app_metadata ->> 'role', u.role, 'user') as role,
    u.created_at,
    p.full_name,
    p.username,
    coalesce(p.is_admin, false) as is_admin,
    m.plan_key,
    m.activated_at,
    m.expires_at
  from auth.users as u
  left join public.profiles p on p.user_id = u.id
  left join lateral (
    select plan_key, activated_at, expires_at
    from public.user_memberships
    where user_id = u.id
      and expires_at >= now()
    order by activated_at desc
    limit 1
  ) m on true
  order by u.created_at desc;
end;
$$;

drop function if exists public.admin_list_activation_codes(int);
create function public.admin_list_activation_codes(p_limit int default 100)
returns table (
  id uuid,
  code text,
  plan_key text,
  duration interval,
  used boolean,
  used_by uuid,
  used_at timestamptz,
  created_at timestamptz
)
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
  select
    ac.id,
    ac.code,
    ac.plan_key,
    ac.duration,
    ac.used,
    ac.used_by,
    ac.used_at,
    ac.created_at
  from public.activation_codes as ac
  order by ac.created_at desc
  limit p_limit;
end;
$$;

drop function if exists public.admin_mark_code_used(text);
create function public.admin_mark_code_used(p_code text)
returns table (
  id uuid,
  code text,
  plan_key text,
  used boolean,
  used_by uuid,
  used_at timestamptz,
  created_at timestamptz
)
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
  update public.activation_codes as ac
  set used = true,
      used_at = now()
  where ac.code = upper(trim(p_code))
  returning
    ac.id,
    ac.code,
    ac.plan_key,
    ac.used,
    ac.used_by,
    ac.used_at,
    ac.created_at;
end;
$$;
