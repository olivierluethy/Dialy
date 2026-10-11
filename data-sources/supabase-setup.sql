-- Dialy: all Supabase migrations (0001-0011) in order, for the SQL Editor.
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



-- ===== 0006_article_editors.sql =====
-- Dialy: Ratgeber articles editable by approved editors (article editor,
-- `npm run editor`). Everyone else keeps read-only access.
--
-- Make an account an editor (SQL Editor, once per person):
--   insert into public.article_editors (user_id)
--   select id from auth.users where email = '<email>';

create table if not exists public.article_editors (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.article_editors enable row level security;

-- Editors can see that they are editors (the editor checks this after login).
drop policy if exists "article_editors_read_own" on public.article_editors;
create policy "article_editors_read_own" on public.article_editors
  for select to authenticated using (user_id = auth.uid());

grant select on public.article_editors to authenticated;

-- security definer: the policies below may look up the table without the
-- caller needing access to other editors' rows.
create or replace function public.is_article_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.article_editors where user_id = auth.uid());
$$;

revoke execute on function public.is_article_editor() from public, anon;
grant execute on function public.is_article_editor() to authenticated;

-- Insert and update only; articles are removed by setting deleted_at.
drop policy if exists "articles_insert_editor" on public.articles;
create policy "articles_insert_editor" on public.articles
  for insert to authenticated with check (public.is_article_editor());

drop policy if exists "articles_update_editor" on public.articles;
create policy "articles_update_editor" on public.articles
  for update to authenticated
  using (public.is_article_editor()) with check (public.is_article_editor());

grant insert, update on public.articles to authenticated;

-- Keep updated_at current on every edit.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists articles_touch_updated_at on public.articles;
create trigger articles_touch_updated_at
  before update on public.articles
  for each row execute function public.touch_updated_at();


-- ===== 0007_contact_messages.sql =====
-- Dialy: messages from the Kontakt form (suggest a new food / report a wrong
-- one). Anyone may send, nobody can read them through the API - read them in
-- the Table Editor or SQL Editor:
--
--   select m.created_at, m.kind, m.food_name, m.message, u.email
--   from public.contact_messages m left join auth.users u on u.id = m.user_id
--   order by m.created_at desc;

create table if not exists public.contact_messages (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  -- Sender's account when signed in (filled from the JWT), else null.
  user_id        uuid default auth.uid() references auth.users (id) on delete set null,
  kind           text not null check (kind in ('new_food', 'food_fix')),
  food_name      text not null check (char_length(food_name) between 1 and 200),
  food_id        text check (char_length(food_id) <= 100), -- food_fix only
  carbs_per_100g numeric check (carbs_per_100g between 0 and 100),
  sugar_per_100g numeric check (sugar_per_100g between 0 and 100),
  fat_per_100g   numeric check (fat_per_100g between 0 and 100),
  message        text not null default '' check (char_length(message) <= 4000),
  app_version    text check (char_length(app_version) <= 40),
  -- For you: set once a message is dealt with.
  handled_at     timestamptz
);

alter table public.contact_messages enable row level security;

-- Insert only, and only as yourself (or anonymously).
drop policy if exists "contact_messages_insert" on public.contact_messages;
create policy "contact_messages_insert" on public.contact_messages
  for insert to anon, authenticated
  with check (handled_at is null and (user_id is null or user_id = auth.uid()));

grant insert on public.contact_messages to anon, authenticated;


-- ===== 0008_contact_messages_editors.sql =====
-- Dialy: editors (public.article_editors, 0006) read the Kontakt messages in
-- the editor (`npm run editor`, tab "Nachrichten") and mark them as handled.
-- Senders still can't read anything back.

drop policy if exists "contact_messages_editor_read" on public.contact_messages;
create policy "contact_messages_editor_read" on public.contact_messages
  for select to authenticated using (public.is_article_editor());

drop policy if exists "contact_messages_editor_update" on public.contact_messages;
create policy "contact_messages_editor_update" on public.contact_messages
  for update to authenticated
  using (public.is_article_editor()) with check (public.is_article_editor());

grant select on public.contact_messages to authenticated;
-- Editors may only toggle "handled", not change what was sent.
grant update (handled_at) on public.contact_messages to authenticated;

-- E-mail addresses of the senders, for replying. auth.users isn't reachable
-- through the API, hence security definer - and editors only.
create or replace function public.contact_message_senders()
returns table (user_id uuid, email text)
language sql
stable
security definer
set search_path = ''
as $$
  select u.id, u.email::text
  from auth.users u
  where public.is_article_editor()
    and u.id in (select m.user_id from public.contact_messages m);
$$;

revoke execute on function public.contact_message_senders() from public, anon;
grant execute on function public.contact_message_senders() to authenticated;


-- ===== 0009_entry_notes.sql =====
-- Dialy: free-text comment per diary entry (Tagebuch, edit popup). Mirrors
-- local schema version 4 (src/db/schema.ts).
--
-- Run this before using an app version with comments: sync pushes whole
-- rows, so without the column every push of a diary entry fails.

alter table public.meal_entries
  add column if not exists note text check (char_length(note) <= 500);

alter table public.sport_entries
  add column if not exists note text check (char_length(note) <= 500);


-- ===== 0010_food_edits.sql =====
-- Dialy: KH-Rechner foods editable by editors (public.article_editors, 0006)
-- in the Dialy-Editor (`npm run editor`, tab "Lebensmittel").
--
-- The foods ship with the app (src/data). public.foods only holds what
-- editors changed or added on top: one full row per food, keyed by the app's
-- food id ("food-…", "brand-…", "blv-…", "bls-…", or "custom-…" for foods
-- added in the editor). The app pulls new rows on start and applies them
-- over the bundled foods (local table food_edits, schema version 5).
-- active = false hides a food in the KH-Rechner.

-- App food ids are text, not uuids. Nothing wrote to this table before.
alter table public.foods alter column id drop default;
alter table public.foods alter column id type text using id::text;

alter table public.foods add column if not exists active boolean not null default true;

alter table public.foods drop constraint if exists foods_values_check;
alter table public.foods add constraint foods_values_check check (
  char_length(id) between 1 and 100
  and char_length(name) between 1 and 200
  and char_length(food_group) <= 100
  and carbs_per_100g between 0 and 100
  and sugar_per_100g between 0 and carbs_per_100g
  and fat_per_100g between 0 and 100
  and (glycemic_index is null or glycemic_index between 0 and 150)
  and jsonb_typeof(portions) = 'array'
);

-- The app asks for rows changed since its last pull.
create index if not exists idx_foods_updated on public.foods (updated_at);

-- Reading stays open to everyone (foods_read, 0002). Insert and update for
-- editors only; foods are hidden by setting active = false, never deleted.
drop policy if exists "foods_insert_editor" on public.foods;
create policy "foods_insert_editor" on public.foods
  for insert to authenticated with check (public.is_article_editor());

drop policy if exists "foods_update_editor" on public.foods;
create policy "foods_update_editor" on public.foods
  for update to authenticated
  using (public.is_article_editor()) with check (public.is_article_editor());

grant insert, update on public.foods to authenticated;

-- touch_updated_at() from 0006.
drop trigger if exists foods_touch_updated_at on public.foods;
create trigger foods_touch_updated_at
  before update on public.foods
  for each row execute function public.touch_updated_at();


-- ===== 0011_contact_other.sql =====
-- Dialy: third Kontakt category "Sonstiges" (kind 'other'). For these
-- messages food_name holds the subject the sender typed.

alter table public.contact_messages
  drop constraint if exists contact_messages_kind_check;

alter table public.contact_messages
  add constraint contact_messages_kind_check
  check (kind in ('new_food', 'food_fix', 'other'));

