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
