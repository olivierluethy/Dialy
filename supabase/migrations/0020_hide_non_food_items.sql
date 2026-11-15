-- Dialy: hide entries that are not food, or that only season food in tiny
-- amounts and are irrelevant for counting carbs: household items that ended
-- up in Open Food Facts (Alufolie, Backpapier), salt, spices, seasoning blends
-- such as Aromat, baking agents/additives and carb-free supplements.
-- Kept on purpose: bouillon (eaten as soup), sauces and pastes (ketchup, senf,
-- sambal), and products merely named after a seasoning (chips "Meersalz und
-- Pfeffer", "Mit Aromat"). Sugar-rich tablets (Traubenzucker) stay visible.
--
-- 90 foods get active = false; nothing is deleted. A row is only touched if
-- its name is still the listed one. The foods_touch_updated_at trigger (0010)
-- bumps updated_at, so the app drops them from the KH-Rechner on its next sync.

update public.foods f
set active = false
from (values
  -- Not food at all
  ('off-7617020445846', 'Alufolie'),
  ('off-7628871628227', 'Backpapier Rolle Nr. 33'),
  ('off-4260078621880', 'Holzbesteckset'),
  ('off-7613312310182', 'Kosmetiktücher'),
  ('off-7610011759175', 'Aussteller'),
  -- Salt
  ('bls-R111000', 'Speisesalz/Siedesalz/Tafelsalz'),
  ('bls-R111100', 'Steinsalz'),
  ('bls-R112000', 'Meersalz'),
  ('bls-R113000', 'Speisesalz jodiert/Jodsalz, mit Fluorid'),
  ('bls-R113100', 'Speisesalz jodiert/Jodsalz, mit Fluorid und Folsäure'),
  ('bls-R114000', 'Speisesalz jodiert/Jodsalz'),
  ('bls-R115000', 'Gewürzsalz/Kräutersalz'),
  ('bls-R118000', 'Nitritpökelsalz'),
  ('bls-R118100', 'Nitritpökelsalz jodiert'),
  ('blv-10457', 'Kochsalz mit Jod und Fluor'),
  ('blv-14086', 'Salz, Meersalz, Standard, weiss, ohne zugesetztes Jod und Fluor'),
  ('blv-14087', 'Salz, Meersalz, Fleur de sel'),
  ('blv-14088', 'Salz, Himalayasalz'),
  ('blv-634', 'Kochsalz ohne Jod und Fluor'),
  ('blv-762', 'Kochsalz mit Jod'),
  ('off-7610313012213', 'Herbamare : Meersalz mit Gemüse und Kräutern'),
  ('off-9002540871868', 'Pommes frites Gewürzsalz'),
  -- Spices and dried herbs
  ('bls-R231000', 'Basilikum getrocknet'),
  ('bls-R258100', 'Pfeffer schwarz, getrocknet'),
  ('blv-14269', 'Rosmarin, getrocknet'),
  ('blv-663', 'Paprika (Gewürz)'),
  ('blv-911', 'Zimt'),
  ('off-4260289449808', 'BIO kurkuma pulver'),
  ('off-5017689002602', 'Hot Madras Curry Powder / Heiße Madras Currypulver'),
  ('off-5998304671628', 'KALOCSAI Milder Gewürzpaprika gemahlen'),
  ('off-7617600003343', 'Garam Marsala Gewürzmischung'),
  ('off-7627534518769', 'Currypulver mild'),
  ('off-4038700102515', 'Kräuterlinge - Frühlingskräuter'),
  ('off-7611100458191', 'Herbmix kräuterlinge - italienische kräuter'),
  ('off-7611100467155', 'Kräuterlinge zum Streuen Provençale'),
  -- Seasoning blends (Aromat & co.)
  ('off-40387444', 'Würzmittel Aromat'),
  ('off-7611100054713', 'Aromat Streuer'),
  ('off-7611100073479', 'Aromat Kräuter'),
  ('off-7611100116350', 'Aromat ohne Glutamat'),
  ('off-7611100417280', 'Aromat'),
  ('off-7611100421317', 'Aromare : Streuwürze mit Kräutern'),
  ('off-7611100447232', 'Würzmischung Streu mi'),
  ('off-7611100447256', 'Streu mi'),
  ('off-7612934124245', 'Streu''mal'),
  ('off-7610121100010', 'Streuwürze'),
  ('off-7613269300564', 'Streuwürze mit Kräutern'),
  ('off-3850104008443', 'Podravka Vegeta Würzmischung mit Gemüse'),
  ('off-3850104008597', 'Gewürze - Vegeta - Würzmischung mit Gemüse'),
  ('off-4061459774245', 'Würzmischung mit gemüse'),
  ('off-7610703040628', 'Rustica Würzmischung'),
  ('off-7610703083830', 'Pepe Tricolore Würzmischung'),
  ('off-4005500016212', 'Maggi'),
  ('off-4005500016236', 'Maggi Würze'),
  ('off-76159244', 'Flüssigwürze für Salate und Suppen'),
  ('off-42394686', 'Würzpaste für Ofen Hähnchen'),
  ('off-42394839', 'Würzpaste Teriyaki'),
  ('off-8410076490131', 'Guacamole Würzmischung Mild'),
  ('off-8410076490810', 'Würzmischung für Fajitas Original Mild'),
  ('off-8410076491435', 'Würzmischung mit Croûtons für Fajitas'),
  ('off-8410076491466', 'PanchoVilla Würzmischung für Mexican Potatoes'),
  ('off-8410076491473', 'Ancho Villa AUTHENTIC MEXICAN Würzmischung mit Croûtons'),
  ('off-8410076491862', 'Taco Würzmischung für Tacos original sweet Paprika & Chili mild 25g 3.49'),
  ('off-8410076491886', 'Mexican MIX Würzmischung'),
  -- Baking agents and additives
  ('bls-R421100', 'Backpulver'),
  ('bls-R421200', 'Hirschhornsalz (Ammoniumhydrogencarbonat, E 503)'),
  ('bls-R434000', 'Sahnestandmittel'),
  ('bls-R458000', 'Backhefe getrocknet (Trockenbackhefe)'),
  ('bls-R459000', 'Backhefe frisch (Frischbackhefe)'),
  ('bls-R468000', 'Gelatine/Speisegelatine'),
  ('bls-R551000', 'Milchsäure 80 % (E 270)'),
  ('bls-R552000', 'Citronensäure/Zitronensäure (E 330)'),
  ('bls-R553000', 'Ascorbinsäure (E 300)'),
  ('bls-R554000', 'Essigsäure 60 % (E 260)'),
  ('blv-763', 'Bäckerhefe, gepresst'),
  ('off-20003333', 'Backpulver (9)'),
  ('off-42260912', 'Trocken-Backhefe'),
  ('off-76400537', 'Hefe trocken'),
  -- Supplements without carbs (tablets, capsules, oils)
  ('off-7613269190837', 'Vision Plus Lutein & Vitamin A'),
  ('off-7613269289791', 'Fischöl Omega-3-Fettsäuren'),
  ('off-7613269289814', 'Nachtkerzenöl'),
  ('off-7613269320289', 'Hair & Nail Biotin & Zink Tablettes'),
  ('off-7613312051917', 'Vitamin C 240mg Vitmain C'),
  ('off-7613312053522', 'All in One Arôme Orange 20 Brausetabletten'),
  ('off-7613312057308', 'Omega-3 Algenöl'),
  ('off-7613312141687', 'Calcium-magnesium'),
  ('off-7613312141700', 'Vitamin C - Orangenaroma'),
  ('off-7613312418901', 'M-Budget · Vitamin C + Zink · Zitronenaroma'),
  ('off-7640153568397', 'Kollagen forte'),
  ('off-7640249150239', 'Veractiv Magnesium Sport'),
  ('off-7640119725734', 'Multivitamin')
) as v(id, name)
where f.id = v.id
  and f.name = v.name
  and f.active;
