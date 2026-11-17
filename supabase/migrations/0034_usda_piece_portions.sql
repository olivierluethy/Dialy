-- Dialy: piece portions for fruit, vegetables, eggs and Gipfeli from USDA
-- FoodData Central (SR Legacy, U.S. Department of Agriculture, public domain /
-- CC0): "1 Stück, klein / mittel / gross" (apple 149 / 182 / 223 g, banana
-- 101 / 118 / 136 g, egg 38 / 44 / 50 g) or "1 Stück" where USDA has one size
-- (kiwi 69 g, apricot 35 g).
--
-- 58 BLV/BLS foods, all eaten by the piece and in their whole form (raw,
-- or potatoes and eggs cooked whole) - see scripts/import-usda-portions.mjs
-- and data-sources/usda-portions-report.txt. The pieces are added after the
-- existing portions (e.g. the usual portion from menuCH); a food that already
-- has one of these labels is left alone, and so are user-owned foods. The
-- KH-Rechner names the source ("| USDA FoodData Central"), the privacy
-- screen lists it. The foods_touch_updated_at trigger (0010) bumps
-- updated_at, so the app picks the changes up on its next sync.

update public.foods f
set portions = f.portions || v.pieces::jsonb
from (values
  -- Apfel geschält, roh
  ('bls-F120100', '[{"label":"1 Stück, klein","grams":149},{"label":"1 Stück, mittel","grams":182},{"label":"1 Stück, gross","grams":223}]'),
  -- Apfel, roh
  ('blv-378', '[{"label":"1 Stück, klein","grams":149},{"label":"1 Stück, mittel","grams":182},{"label":"1 Stück, gross","grams":223}]'),
  -- Aprikose, roh
  ('blv-379', '[{"label":"1 Stück","grams":35}]'),
  -- Avocado, roh
  ('blv-380', '[{"label":"1 Stück","grams":201}]'),
  -- Banane, roh
  ('blv-381', '[{"label":"1 Stück, klein","grams":101},{"label":"1 Stück, mittel","grams":118},{"label":"1 Stück, gross","grams":136}]'),
  -- Batate/Süßkartoffel, gebacken
  ('bls-K420162', '[{"label":"1 Stück","grams":130}]'),
  -- Batate/Süßkartoffel, gekocht
  ('bls-K420132', '[{"label":"1 Stück","grams":130}]'),
  -- Batate/Süßkartoffel, roh
  ('bls-K420100', '[{"label":"1 Stück","grams":130}]'),
  -- Birne, roh
  ('blv-382', '[{"label":"1 Stück, klein","grams":148},{"label":"1 Stück, mittel","grams":178},{"label":"1 Stück, gross","grams":230}]'),
  -- Buttergipfeli, hell
  ('blv-836', '[{"label":"1 Stück, klein","grams":42},{"label":"1 Stück, mittel","grams":57},{"label":"1 Stück, gross","grams":67}]'),
  -- Buttergipfeli, Vollkorn
  ('blv-834', '[{"label":"1 Stück, klein","grams":42},{"label":"1 Stück, mittel","grams":57},{"label":"1 Stück, gross","grams":67}]'),
  -- Clementine roh
  ('bls-F607100', '[{"label":"1 Stück","grams":74}]'),
  -- Croissant (Hefeblätterteig/Plunderteig)
  ('bls-D771600', '[{"label":"1 Stück, klein","grams":42},{"label":"1 Stück, mittel","grams":57},{"label":"1 Stück, gross","grams":67}]'),
  -- Dattel roh
  ('bls-F504100', '[{"label":"1 Stück","grams":24}]'),
  -- Feige, roh
  ('blv-386', '[{"label":"1 Stück, klein","grams":40},{"label":"1 Stück, mittel","grams":50},{"label":"1 Stück, gross","grams":64}]'),
  -- Gipfeli (Durchschnitt)
  ('blv-10406', '[{"label":"1 Stück, klein","grams":42},{"label":"1 Stück, mittel","grams":57},{"label":"1 Stück, gross","grams":67}]'),
  -- Granatapfel, roh
  ('blv-13882', '[{"label":"1 Stück","grams":282}]'),
  -- Guave roh
  ('bls-F513100', '[{"label":"1 Stück","grams":55}]'),
  -- Gurke, roh
  ('blv-354', '[{"label":"1 Stück","grams":301}]'),
  -- Hühnerei gebacken
  ('bls-E111162', '[{"label":"1 Stück, klein","grams":38},{"label":"1 Stück, mittel","grams":44},{"label":"1 Stück, gross","grams":50}]'),
  -- Hühnerei gekocht
  ('bls-E111132', '[{"label":"1 Stück, klein","grams":38},{"label":"1 Stück, mittel","grams":44},{"label":"1 Stück, gross","grams":50}]'),
  -- Hühnerei pochiert
  ('bls-E107122', '[{"label":"1 Stück, klein","grams":38},{"label":"1 Stück, mittel","grams":44},{"label":"1 Stück, gross","grams":50}]'),
  -- Hühnerei roh
  ('bls-E111100', '[{"label":"1 Stück, klein","grams":38},{"label":"1 Stück, mittel","grams":44},{"label":"1 Stück, gross","grams":50}]'),
  -- Hühnerei, ganz, roh
  ('blv-290', '[{"label":"1 Stück, klein","grams":38},{"label":"1 Stück, mittel","grams":44},{"label":"1 Stück, gross","grams":50}]'),
  -- Kaki, roh
  ('blv-393', '[{"label":"1 Stück","grams":168}]'),
  -- Karotte, roh
  ('blv-355', '[{"label":"1 Stück, klein","grams":50},{"label":"1 Stück, mittel","grams":61},{"label":"1 Stück, gross","grams":72}]'),
  -- Karotte/Möhre, roh
  ('bls-G620100', '[{"label":"1 Stück, klein","grams":50},{"label":"1 Stück, mittel","grams":61},{"label":"1 Stück, gross","grams":72}]'),
  -- Kartoffel geschält, gebacken
  ('bls-K110162', '[{"label":"1 Stück, klein","grams":170},{"label":"1 Stück, mittel","grams":213},{"label":"1 Stück, gross","grams":369}]'),
  -- Kartoffel geschält, gekocht
  ('bls-K110132', '[{"label":"1 Stück, klein","grams":170},{"label":"1 Stück, mittel","grams":213},{"label":"1 Stück, gross","grams":369}]'),
  -- Kartoffel ungeschält, gebacken
  ('bls-K120164', '[{"label":"1 Stück, klein","grams":170},{"label":"1 Stück, mittel","grams":213},{"label":"1 Stück, gross","grams":369}]'),
  -- Kartoffel ungeschält, gekocht
  ('bls-K120134', '[{"label":"1 Stück, klein","grams":170},{"label":"1 Stück, mittel","grams":213},{"label":"1 Stück, gross","grams":369}]'),
  -- Kartoffel ungeschält, roh
  ('bls-K120100', '[{"label":"1 Stück, klein","grams":170},{"label":"1 Stück, mittel","grams":213},{"label":"1 Stück, gross","grams":369}]'),
  -- Kartoffel, früh, ungeschält, im Wasser gekocht (ohne Salz)
  ('blv-14259', '[{"label":"1 Stück, klein","grams":170},{"label":"1 Stück, mittel","grams":213},{"label":"1 Stück, gross","grams":369}]'),
  -- Kartoffel, geschält, gedämpft (ohne Zugabe von Salz)
  ('blv-1057', '[{"label":"1 Stück, klein","grams":170},{"label":"1 Stück, mittel","grams":213},{"label":"1 Stück, gross","grams":369}]'),
  -- Kartoffel, geschält, roh
  ('blv-813', '[{"label":"1 Stück, klein","grams":170},{"label":"1 Stück, mittel","grams":213},{"label":"1 Stück, gross","grams":369}]'),
  -- Kartoffel, ungeschält, im Ofen gebacken (ohne Zugabe von Fett und Salz)
  ('blv-14258', '[{"label":"1 Stück, klein","grams":170},{"label":"1 Stück, mittel","grams":213},{"label":"1 Stück, gross","grams":369}]'),
  -- Kiwi, roh
  ('blv-395', '[{"label":"1 Stück","grams":69}]'),
  -- Limette roh
  ('bls-F602100', '[{"label":"1 Stück","grams":67}]'),
  -- Mandarine, roh
  ('blv-397', '[{"label":"1 Stück, klein","grams":76},{"label":"1 Stück, mittel","grams":88},{"label":"1 Stück, gross","grams":120}]'),
  -- Mango, roh
  ('blv-396', '[{"label":"1 Stück","grams":336}]'),
  -- Maracuja/Passionsfrucht, roh
  ('bls-F508100', '[{"label":"1 Stück","grams":18}]'),
  -- Orange, roh
  ('blv-405', '[{"label":"1 Stück, klein","grams":96},{"label":"1 Stück, mittel","grams":131},{"label":"1 Stück, gross","grams":184}]'),
  -- Passionsfrucht, roh
  ('blv-986', '[{"label":"1 Stück","grams":18}]'),
  -- Peperoni, grün, roh
  ('blv-359', '[{"label":"1 Stück, klein","grams":74},{"label":"1 Stück, mittel","grams":119},{"label":"1 Stück, gross","grams":164}]'),
  -- Peperoni, rot, roh
  ('blv-360', '[{"label":"1 Stück, klein","grams":74},{"label":"1 Stück, mittel","grams":119},{"label":"1 Stück, gross","grams":164}]'),
  -- Pfirsich roh
  ('bls-F203100', '[{"label":"1 Stück, klein","grams":130},{"label":"1 Stück, mittel","grams":150},{"label":"1 Stück, gross","grams":175}]'),
  -- Pfirsich, gelb, roh
  ('blv-401', '[{"label":"1 Stück, klein","grams":130},{"label":"1 Stück, mittel","grams":150},{"label":"1 Stück, gross","grams":175}]'),
  -- Pflaume, roh
  ('blv-474', '[{"label":"1 Stück","grams":66}]'),
  -- Quitte, roh
  ('blv-476', '[{"label":"1 Stück","grams":92}]'),
  -- Süsskartoffel, gedämpft (ohne Zugabe von Salz)
  ('blv-13407', '[{"label":"1 Stück","grams":130}]'),
  -- Süsskartoffel, im Ofen gebacken (ohne Zubage von Fett und Salz)
  ('blv-14262', '[{"label":"1 Stück","grams":130}]'),
  -- Süsskartoffel, roh
  ('blv-13406', '[{"label":"1 Stück","grams":130}]'),
  -- Tomate, roh
  ('blv-348', '[{"label":"1 Stück, klein","grams":91},{"label":"1 Stück, mittel","grams":123},{"label":"1 Stück, gross","grams":182}]'),
  -- Zitrone, roh
  ('blv-398', '[{"label":"1 Stück","grams":58}]'),
  -- Zucchetti, roh
  ('blv-367', '[{"label":"1 Stück, klein","grams":118},{"label":"1 Stück, mittel","grams":196},{"label":"1 Stück, gross","grams":323}]'),
  -- Zucchini roh
  ('bls-G582100', '[{"label":"1 Stück, klein","grams":118},{"label":"1 Stück, mittel","grams":196},{"label":"1 Stück, gross","grams":323}]'),
  -- Zwetschge, roh
  ('blv-479', '[{"label":"1 Stück","grams":66}]'),
  -- Zwiebel, roh
  ('blv-368', '[{"label":"1 Stück, klein","grams":70},{"label":"1 Stück, mittel","grams":110},{"label":"1 Stück, gross","grams":150}]')
) as v(id, pieces)
where f.id = v.id
  and f.user_id is null
  and jsonb_typeof(f.portions) = 'array'
  and not exists (
    select 1 from jsonb_array_elements(f.portions) e
    where e->>'label' in ('1 Stück', '1 Stück, klein', '1 Stück, mittel', '1 Stück, gross')
  );
