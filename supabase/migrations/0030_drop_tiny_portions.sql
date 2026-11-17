-- Dialy: drop portions below 10 g from imported foods. Most come from
-- Open Food Facts package data and are wrong ("Basmati-Reis" 1 g,
-- "Bauernspeck" 4.3 g); the menuCH ones (7-9 g) are a spoon of oil, seeds or
-- kernels, which hardly matters for counting carbs. A food without a
-- portion is entered in grams.
--
-- Only Open Food Facts, BLV and BLS rows (off-/blv-/bls-) are touched:
-- curated foods keep their small portions on purpose (Traubenzucker
-- "1 Plättchen" = 6 g, the usual unit to treat a hypo), and user-owned or
-- Dialy-Editor foods are left alone. Other portions of a food stay.
-- At the time of writing this affects about 300 foods. The
-- foods_touch_updated_at trigger (0010) bumps updated_at, so the app pulls
-- the changes on its next sync. scripts/article-editor.mjs, import-off.mjs
-- and import-menuch.mjs apply the same 10 g limit.

update public.foods f
set portions = coalesce((
  select jsonb_agg(p order by i)
  from jsonb_array_elements(f.portions) with ordinality as e(p, i)
  where coalesce((p->>'grams')::numeric, 0) >= 10
), '[]'::jsonb)
where f.user_id is null
  and (f.id like 'off-%' or f.id like 'blv-%' or f.id like 'bls-%')
  and jsonb_typeof(f.portions) = 'array'
  and exists (
    select 1 from jsonb_array_elements(f.portions) p
    where coalesce((p->>'grams')::numeric, 0) < 10
  );
