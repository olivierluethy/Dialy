-- Dialy: the KH-Rechner only lists foods with at least 3 g carbohydrates per
-- 100 g. Below that (cheese, meat, fish, eggs, oils, leafy vegetables and
-- salad, mushrooms, black coffee, sugar-free drinks …) a usual portion has
-- hardly any carbs to count, and the entries only make the list long. This
-- extends 0023, which hid exactly 0 g.
--
-- About 4000 foods get active = false (BLV, BLS, Open Food Facts and the
-- curated Hartkäse, Ei, Pouletbrust and Rivella Blau); nothing is deleted,
-- diary entries keep working, and a food can be re-activated in the
-- Dialy-Editor. User-owned foods are not touched. The Dialy-Editor transfers
-- new foods under 3 g as inactive from now on. The foods_touch_updated_at
-- trigger (0010) bumps updated_at, so the app drops them on its next sync.

update public.foods
set active = false
where carbs_per_100g < 3
  and user_id is null
  and active;
