-- ProofLoop initial schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.

-- =========================================================================
-- profiles: one row per auth.users, stores name + role
-- =========================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  role text not null default 'student' check (role in ('student', 'teacher')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- =========================================================================
-- Trigger: auto-create profile row when a new auth user signs up
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- updated_at auto-maintenance for profiles
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- =========================================================================
-- keepalive: tiny public-readable table so the GitHub Actions cron can
-- perform a real DB query and prevent the free-tier Supabase project from
-- being paused for inactivity.
-- =========================================================================
create table if not exists public.keepalive (
  id int primary key,
  last_ping timestamptz not null default now()
);

insert into public.keepalive (id) values (1)
  on conflict (id) do nothing;

alter table public.keepalive enable row level security;

drop policy if exists "keepalive_anon_read" on public.keepalive;
create policy "keepalive_anon_read"
  on public.keepalive for select
  to anon
  using (true);
