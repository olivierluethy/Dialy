-- Dialy: continuous-glucose readings imported from CGM sensors (issue #21).
--
-- Stored in mg/dL (the providers' raw unit); the app shows mmol/L or mg/dL.
-- Two-way synced and owner-only, like the other user tables. Deduped by
-- (user_id, source, source_record_id) so re-imports add nothing.

create table if not exists public.glucose_readings (
  id                 uuid primary key,
  user_id            uuid not null references auth.users (id) on delete cascade,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  source             text not null check (source in ('dexcom', 'libre', 'manual', 'health_platform')),
  source_record_id   text not null check (char_length(source_record_id) between 1 and 200),
  timestamp_utc      timestamptz not null,
  display_time_local text not null,
  value_mgdl         numeric not null check (value_mgdl between 0 and 1000),
  trend              text,
  status             text,
  imported_at        timestamptz not null default now()
);

create index if not exists idx_glucose_user_time
  on public.glucose_readings (user_id, timestamp_utc);

-- No duplicate readings per account and source (only live rows count).
create unique index if not exists idx_glucose_dedup
  on public.glucose_readings (user_id, source, source_record_id)
  where deleted_at is null;

alter table public.glucose_readings enable row level security;

drop policy if exists "glucose_select" on public.glucose_readings;
create policy "glucose_select" on public.glucose_readings
  for select using (auth.uid() = user_id);
drop policy if exists "glucose_insert" on public.glucose_readings;
create policy "glucose_insert" on public.glucose_readings
  for insert with check (auth.uid() = user_id);
drop policy if exists "glucose_update" on public.glucose_readings;
create policy "glucose_update" on public.glucose_readings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "glucose_delete" on public.glucose_readings;
create policy "glucose_delete" on public.glucose_readings
  for delete using (auth.uid() = user_id);

grant select, insert, update, delete on public.glucose_readings to authenticated;

-- "Daten löschen" (0014) erases meals/sport/BG; glucose goes with them.
create or replace function public.erase_my_data()
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  ts  timestamptz := now();
begin
  if uid is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  delete from public.meal_entries    where user_id = uid;
  delete from public.sport_entries   where user_id = uid;
  delete from public.bg_readings     where user_id = uid;
  delete from public.glucose_readings where user_id = uid;
  insert into public.data_erasures (user_id, erased_at) values (uid, ts)
    on conflict (user_id) do update set erased_at = excluded.erased_at;
  return ts;
end;
$$;

revoke execute on function public.erase_my_data() from public, anon;
grant execute on function public.erase_my_data() to authenticated;

-- Drop rows that predate an erasure, as for the other synced tables (0014).
drop trigger if exists glucose_readings_skip_erased on public.glucose_readings;
create trigger glucose_readings_skip_erased
  before insert or update on public.glucose_readings
  for each row execute function public.skip_erased_rows();
