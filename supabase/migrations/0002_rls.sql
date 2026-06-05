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
