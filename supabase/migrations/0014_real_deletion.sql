-- Dialy: "Daten löschen" and "Konto löschen" really delete on the server.
--
-- Before, "Daten löschen" only set deleted_at, so every entry stayed in the
-- database. Now:
--  - erase_my_data() removes the caller's meals, sport and BG readings and
--    notes the time in data_erasures (no health data, only user + time).
--    Other devices read that marker on sync and delete their local copies
--    (src/sync/syncEngine.ts); rows they push afterwards that are older than
--    the erasure are dropped by the trigger below.
--  - delete_my_account() removes the auth user; everything owned by it goes
--    with it (on delete cascade), Kontakt messages keep no user_id.

create table if not exists public.data_erasures (
  user_id   uuid primary key references auth.users (id) on delete cascade,
  erased_at timestamptz not null
);

alter table public.data_erasures enable row level security;

drop policy if exists "data_erasures_read_own" on public.data_erasures;
create policy "data_erasures_read_own" on public.data_erasures
  for select to authenticated using (user_id = auth.uid());

grant select on public.data_erasures to authenticated;

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
  delete from public.meal_entries  where user_id = uid;
  delete from public.sport_entries where user_id = uid;
  delete from public.bg_readings   where user_id = uid;
  insert into public.data_erasures (user_id, erased_at) values (uid, ts)
    on conflict (user_id) do update set erased_at = excluded.erased_at;
  return ts;
end;
$$;

revoke execute on function public.erase_my_data() from public, anon;
grant execute on function public.erase_my_data() to authenticated;

-- Drops (without an error, so the device's sync queue moves on) rows that
-- were last changed before the owner erased their data - e.g. pushed by a
-- device that was offline during the erasure.
create or replace function public.skip_erased_rows()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.data_erasures e
    where e.user_id = new.user_id and new.updated_at <= e.erased_at
  ) then
    return null;
  end if;
  return new;
end;
$$;

drop trigger if exists meal_entries_skip_erased on public.meal_entries;
create trigger meal_entries_skip_erased
  before insert or update on public.meal_entries
  for each row execute function public.skip_erased_rows();

drop trigger if exists sport_entries_skip_erased on public.sport_entries;
create trigger sport_entries_skip_erased
  before insert or update on public.sport_entries
  for each row execute function public.skip_erased_rows();

drop trigger if exists bg_readings_skip_erased on public.bg_readings;
create trigger bg_readings_skip_erased
  before insert or update on public.bg_readings
  for each row execute function public.skip_erased_rows();

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
