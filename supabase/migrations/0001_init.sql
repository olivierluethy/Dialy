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
