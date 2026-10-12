-- Dialy: all KH-Rechner foods come from the database (no foods bundled
-- with the app any more). public.foods now holds every food - curated,
-- brand drinks, BLV, BLS, Open Food Facts and the ones added in the
-- Dialy-Editor - instead of only the edited ones (0010).
--
-- Fill it once in the Dialy-Editor (`npm run editor`, tab "Lebensmittel",
-- "In die Datenbank übernehmen"); the app downloads it on start and keeps a
-- local copy for offline use (src/services/foodSync.ts).

-- Names in the other UI languages, e.g. {"en": "Apple", "fr": "Pomme"}.
-- German stays in name.
alter table public.foods add column if not exists names jsonb not null default '{}'::jsonb;

alter table public.foods drop constraint if exists foods_names_check;
alter table public.foods add constraint foods_names_check check (jsonb_typeof(names) = 'object');

-- The app pages through the table by (updated_at, id): one import writes
-- thousands of rows with the same updated_at.
drop index if exists public.idx_foods_updated;
create index if not exists idx_foods_updated_id on public.foods (updated_at, id);
