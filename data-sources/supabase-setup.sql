-- Dialy: all Supabase migrations (0001-0005) in order, for the SQL Editor.
-- Generated from supabase/migrations - edit those files, not this one.

-- ===== 0001_init.sql =====
-- Dialy — initial schema (Supabase / PostgreSQL).
-- Mirrors the local SQLite model (§7). Every syncable table carries:
--   id (uuid, client-generated PK), user_id, created_at, updated_at,
--   deleted_at (nullable; SOFT DELETE only).
--
-- Run with the Supabase CLI:  supabase db push
-- (RLS policies live in 0002_rls.sql and MUST be applied.)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Read-mostly content (synced DOWN to clients). Not user-owned.
-- ---------------------------------------------------------------------------
create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,
  category      text not null,
  title         text not null,
  body          text not null,
  read_minutes  int  not null,
  published_at  date not null,
  diabetes_type text not null check (diabetes_type in ('t1','t2','both'))
);

create table if not exists public.foods (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz,
  name           text not null,
  food_group     text not null,
  carbs_per_100g numeric not null,
  sugar_per_100g numeric not null,
  fat_per_100g   numeric not null,
  glycemic_index numeric not null,
  portions       jsonb not null default '[]'::jsonb
);

-- ---------------------------------------------------------------------------
-- User-owned data (two-way sync; RLS restricts to user_id = auth.uid()).
-- ---------------------------------------------------------------------------
create table if not exists public.meal_entries (
  id             uuid primary key,
  user_id        uuid not null references auth.users(id) on delete cascade,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz,
  food_id        text,
  name           text not null,
  grams          numeric not null,
  carbs_g        numeric not null,
  sugar_g        numeric not null,
  fat_g          numeric not null,
  glycemic_index numeric not null,
  be             numeric not null,
  photo_uri      text,
  logged_at      timestamptz not null
);

create table if not exists public.sport_entries (
  id                  uuid primary key,
  user_id             uuid not null references auth.users(id) on delete cascade,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  deleted_at          timestamptz,
  activity            text not null,
  duration_min        int not null,
  bg_before_mmol      numeric not null,
  carbs_before_g      numeric not null,
  carbs_before_hours  numeric not null,
  carbs_after_g       numeric not null,
  carbs_after_hours   numeric not null,
  pump_reduction_pct  numeric,
  pump_reduction_min  numeric,
  bg_curve            jsonb not null default '[]'::jsonb,
  logged_at           timestamptz not null
);

create table if not exists public.bg_readings (
  id          uuid primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz,
  value_mmol  numeric not null,
  source      text not null check (source in ('manual','cgm')),
  logged_at   timestamptz not null
);

create table if not exists public.profiles (
  id            uuid primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,
  diabetes_type text not null default 't1',
  is_premium    boolean not null default false,
  settings      jsonb not null default '{}'::jsonb
);

create index if not exists idx_meal_user on public.meal_entries(user_id, logged_at);
create index if not exists idx_sport_user on public.sport_entries(user_id, logged_at);
create index if not exists idx_bg_user on public.bg_readings(user_id, logged_at);


-- ===== 0002_rls.sql =====
-- Dialy — Row-Level Security (§7 security requirement).
--
-- The client only ever talks to Supabase with the public anon key + the
-- user's JWT. RLS guarantees a user can read/write ONLY their own rows
-- (user_id = auth.uid()). Read-mostly content (articles, foods) is world-
-- readable but not client-writable.
--
-- No service-role key or DB credentials ever live in the client.

-- ---------------------------------------------------------------------------
-- Content: readable by everyone (incl. anon), writable by no client.
-- ---------------------------------------------------------------------------
alter table public.articles enable row level security;
alter table public.foods    enable row level security;

drop policy if exists "articles_read" on public.articles;
create policy "articles_read" on public.articles
  for select using (true);

drop policy if exists "foods_read" on public.foods;
create policy "foods_read" on public.foods
  for select using (true);

-- ---------------------------------------------------------------------------
-- User-owned tables: full CRUD limited to the owner.
-- ---------------------------------------------------------------------------
alter table public.meal_entries  enable row level security;
alter table public.sport_entries enable row level security;
alter table public.bg_readings   enable row level security;
alter table public.profiles      enable row level security;

-- Helper: identical owner-only policy set per table.
-- meal_entries
drop policy if exists "meal_select" on public.meal_entries;
create policy "meal_select" on public.meal_entries
  for select using (auth.uid() = user_id);
drop policy if exists "meal_insert" on public.meal_entries;
create policy "meal_insert" on public.meal_entries
  for insert with check (auth.uid() = user_id);
drop policy if exists "meal_update" on public.meal_entries;
create policy "meal_update" on public.meal_entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "meal_delete" on public.meal_entries;
create policy "meal_delete" on public.meal_entries
  for delete using (auth.uid() = user_id);

-- sport_entries
drop policy if exists "sport_select" on public.sport_entries;
create policy "sport_select" on public.sport_entries
  for select using (auth.uid() = user_id);
drop policy if exists "sport_insert" on public.sport_entries;
create policy "sport_insert" on public.sport_entries
  for insert with check (auth.uid() = user_id);
drop policy if exists "sport_update" on public.sport_entries;
create policy "sport_update" on public.sport_entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "sport_delete" on public.sport_entries;
create policy "sport_delete" on public.sport_entries
  for delete using (auth.uid() = user_id);

-- bg_readings
drop policy if exists "bg_select" on public.bg_readings;
create policy "bg_select" on public.bg_readings
  for select using (auth.uid() = user_id);
drop policy if exists "bg_insert" on public.bg_readings;
create policy "bg_insert" on public.bg_readings
  for insert with check (auth.uid() = user_id);
drop policy if exists "bg_update" on public.bg_readings;
create policy "bg_update" on public.bg_readings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "bg_delete" on public.bg_readings;
create policy "bg_delete" on public.bg_readings
  for delete using (auth.uid() = user_id);

-- profiles
drop policy if exists "profile_select" on public.profiles;
create policy "profile_select" on public.profiles
  for select using (auth.uid() = user_id);
drop policy if exists "profile_insert" on public.profiles;
create policy "profile_insert" on public.profiles
  for insert with check (auth.uid() = user_id);
drop policy if exists "profile_update" on public.profiles;
create policy "profile_update" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- ===== 0003_grants.sql =====
-- Dialy — table privilege grants for the API roles.
--
-- 0001 creates the tables and 0002 enables RLS + owner-only policies, but
-- neither GRANTs table privileges to the PostgREST roles (`anon`,
-- `authenticated`). Without these grants PostgREST rejects every request with
-- 403 "permission denied for table" *before* RLS is even evaluated — so auth'd
-- users could not read or write their own rows and sync failed.
--
-- RLS still enforces row ownership (user_id = auth.uid()); these grants only
-- open the table at the SQL-privilege layer so the policies can do their job.

-- Read-mostly content: world-readable (matches the "articles_read"/"foods_read"
-- policies), never client-writable.
grant select on public.articles to anon, authenticated;
grant select on public.foods    to anon, authenticated;

-- User-owned tables: full CRUD for signed-in users; RLS limits it to own rows.
grant select, insert, update, delete on public.meal_entries  to authenticated;
grant select, insert, update, delete on public.sport_entries to authenticated;
grant select, insert, update, delete on public.bg_readings   to authenticated;
grant select, insert, update, delete on public.profiles      to authenticated;


-- ===== 0004_nullable_glycemic_index.sql =====
-- Dialy — glycaemic index becomes optional.
--
-- Foods from the Swiss Food Composition Database (BLV) carry no glycaemic
-- index, so meals built from them have none either. Mirrors local schema
-- version 2 (src/db/schema.ts).

alter table public.foods alter column glycemic_index drop not null;
alter table public.meal_entries alter column glycemic_index drop not null;


-- ===== 0005_food_categories.sql =====
-- Dialy — top-level food categories (KH-Rechner filter).
--
-- ";"-separated category names (Swiss Food Composition Database). Mirrors
-- local schema version 3 (src/db/schema.ts).

alter table public.foods add column if not exists categories text not null default '';


