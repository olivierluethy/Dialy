-- Dialy: remove stray characters at the start or end of Open Food Facts food
-- names: "´Aubergines" -> "Aubergines", "+ Protein fitness quark" ->
-- "Protein Fitness Quark", "… ohneZuckerzusatz*", "Eis (Cornetto) &",
-- "… Korn an Korn |1688|". "Getrocknete 🍅" becomes "Getrocknete Tomaten",
-- which already exists with nearly the same carbs, so it is hidden instead
-- (same rule as 0026). Nothing is deleted.
-- Kept: a "+" that belongs to the product name ("Calin+", "Spaghetti
-- Protein+", "Manuka Honig MGO 400+") and quotation marks.
--
-- A row is only touched if its name is still the listed one, so later edits
-- in the Dialy-Editor are not overwritten. The foods_touch_updated_at trigger
-- (0010) bumps updated_at, so the app picks the changes up on its next sync.

update public.foods f
set name = v.new_name
from (values
  ('off-7613312081204', 'Apfel-Mangomus ohneZuckerzusatz*', 'Apfel-Mangomus ohne Zuckerzusatz'),
  ('off-7613312372463', '´Aubergines', 'Aubergines'),
  ('off-8712100708831', 'Eis (Cornetto) &', 'Cornetto Eis'),
  ('off-4056489098607', 'Mascarpone Free From lactose*', 'Mascarpone Free From lactose'),
  ('off-4103840019266', '+ Protein fitness quark', 'Protein Fitness Quark'),
  ('off-4071800000824', 'Vollkorn-Brot Korn an Korn |1688|', 'Vollkorn-Brot Korn an Korn')
) as v(id, name, new_name)
where f.id = v.id
  and f.name = v.name;

update public.foods f
set active = false
from (values
  -- -> Getrocknete Tomaten (off-7613269197966)
  ('off-20089429', 'Getrocknete 🍅')
) as v(id, name)
where f.id = v.id
  and f.name = v.name
  and f.active;
