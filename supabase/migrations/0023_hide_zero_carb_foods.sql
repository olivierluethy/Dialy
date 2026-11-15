-- Dialy: hide foods without carbohydrates. The KH-Rechner is for counting
-- carbs, so entries with exactly 0 g per 100 g (meat, fish, most cheese, oils,
-- sugar-free drinks) only make the list longer. They get active = false;
-- nothing is deleted, diary entries keep working, and a food can be
-- re-activated in the Dialy-Editor. Foods with small amounts (e.g. 0.5 g)
-- stay visible. User-owned foods are not touched.
-- At the time of writing this hides about 1175 foods. The
-- foods_touch_updated_at trigger (0010) bumps updated_at, so the app drops
-- them on its next sync.

update public.foods
set active = false
where carbs_per_100g = 0
  and user_id is null
  and active;
