-- Dialy: remove shop prices from Open Food Facts food names, which 0027 did
-- not catch: "STORCK Toffifee Double Chocolate 125g 1.49€ 1kg 11.92€" ->
-- "Storck Toffifee Double Chocolate", "Magnum Almond-3,69€/1.7.22" ->
-- "Magnum Almond", "Hohes C Orangensaft PETE 1 0.25€ Pfand …" -> "Hohes C
-- Orangensaft". Pack sizes and the shop in front of the brand (EDEKA, LIDL,
-- Rossmann) go too, as in 0018 and 0027. None of the cleaned names clashes
-- with an existing food. Nothing is deleted.
--
-- A row is only touched if its name is still the listed one, so later edits
-- in the Dialy-Editor are not overwritten. The foods_touch_updated_at trigger
-- (0010) bumps updated_at, so the app picks the changes up on its next sync.

update public.foods f
set name = v.new_name
from (values
  ('off-4104420237971', 'Rossmann Alnatura Kichererbsenwaffeln 100g 0.99€ 1kg 9.90€', 'Alnatura Kichererbsenwaffeln'),
  ('off-4305615664101', 'Rossmann ener Bio Bio Haferflocken Feinblatt 500g 0.85€ 1kg 1.70€', 'EnerBio Haferflocken Feinblatt'),
  ('off-4048517701818', 'Hohes C Orangensaft PETE 1 0.25€ Pfand hohes C Saft 1l 0.99€', 'Hohes C Orangensaft'),
  ('off-20198091', 'LIDL Italiamo Polpa di pomodoro all’arrabiata 400g 0.99€ 1kg 4.98€', 'Italiamo Polpa di pomodoro all’arrabbiata'),
  ('off-20849597', 'Lidl Salame Italiamo Brianza DOP Pro 80g 2.18€ 100g 3.74€ 1kg 37.40€', 'Italiamo Salame Brianza DOP'),
  ('off-4000540043587', 'EDEKA Müsli Kölln Müsli Knusper Schoko-Krokant 500g 2.49€ 1kg 4.98€', 'Kölln Müsli Knusper Schoko-Krokant'),
  ('off-40122175', 'Kühne MADE FOR MEAT BBQ CRANBERRY 375ml 1.99€ 1kg 5,31€', 'Kühne Made for Meat BBQ Cranberry'),
  ('off-8712566404629', 'Magnum Almond-3,69€/1.7.22', 'Magnum Almond'),
  ('off-4008258291016', 'EDEKA Seeberger SOFT PFLAUMEN 200g ???€ 1kg ???€', 'Seeberger Soft Pflaumen'),
  ('off-4014400931358', 'STORCK Toffifee Double Chocolate 125g 1.49€ 1kg 11.92€', 'Storck Toffifee Double Chocolate'),
  ('off-9120003413254', 'TANTE FANNY frischer XXL-Blech-Pizzateig xxl 550g 2.79€ 1kg 3.62€', 'Tante Fanny frischer XXL-Blech-Pizzateig')
) as v(id, name, new_name)
where f.id = v.id
  and f.name = v.name;
