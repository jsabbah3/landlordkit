-- LandlordKit — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- It creates the `profiles` table that mirrors each user's Pro status. The
-- Stripe webhook writes to it with the service-role key (bypassing RLS); the
-- app reads a user's own row via RLS.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  stripe_customer_id text,
  plan text,                       -- Stripe price id of the active subscription
  status text default 'free',      -- free | active | trialing | past_due | canceled
  current_period_end timestamptz,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- A user can read and update only their own profile row.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Email list (lead magnet signups). Written only by the server with the
-- service-role key; RLS is enabled with no policies, so anon/browser clients
-- can neither read nor write it.
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,                     -- where they signed up (e.g. 'homepage', 'guide:slug')
  created_at timestamptz default now()
);

alter table public.subscribers enable row level security;

-- Compliance Calendar: one saved profile (JSONB) per user. RLS = owner-only.
create table if not exists public.compliance_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.compliance_profiles enable row level security;

drop policy if exists "cp_select_own" on public.compliance_profiles;
create policy "cp_select_own" on public.compliance_profiles
  for select using (auth.uid() = user_id);

drop policy if exists "cp_insert_own" on public.compliance_profiles;
create policy "cp_insert_own" on public.compliance_profiles
  for insert with check (auth.uid() = user_id);

drop policy if exists "cp_update_own" on public.compliance_profiles;
create policy "cp_update_own" on public.compliance_profiles
  for update using (auth.uid() = user_id);
