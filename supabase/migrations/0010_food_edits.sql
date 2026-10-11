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
