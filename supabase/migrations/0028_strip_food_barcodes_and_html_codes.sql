-- Dialy: remove barcodes and HTML character codes from Open Food Facts food
-- names:
--   EAN numbers   "Alnatura Linsenwaffeln 4104420231658 Bio Linsenwaffeln mit
--                 Salz, glutenfrei" -> "Alnatura Linsenwaffeln". The text after
--                 the barcode mostly repeats the name; it is kept only where
--                 the part before it says too little ("Little Italy
--                 4281010878001 Bio Suppe mit Tomate und Zucchini" ->
--                 "Little Italy Bio Suppe mit Tomate und Zucchini"). Pack
--                 sizes next to the barcode go too ("… 800g 4037300108491").
--   HTML codes    &quot; -> ", stray &lt; / &gt; removed
--                 ("Frikadelle &gt;" -> "Frikadelle").
-- Translations in `names` need no change: the only affected one ("… (Freshly
-- Made with &lt;3)") already lost its trailing parenthesis in 0016.
--
-- Step 1 renames 51 entries.
-- Step 2 hides 3 entries whose cleaned name already exists with carbs
-- within 3 g or 15 % (same rule as 0026). Nothing is deleted.
--
-- A row is only touched if its name is still the listed one, so later edits
-- in the Dialy-Editor are not overwritten. The foods_touch_updated_at trigger
-- (0010) bumps updated_at, so the app picks the changes up on its next sync.

update public.foods f
set name = v.new_name
from (values
  ('off-4260462982108', '3Bears Pocket Porrige Zimtiger Apfel 4260462982108 Porridge-Riegel (Müsliriegel auf Haferbasis) mit Apfel und Zimt', '3Bears Pocket Porridge Zimtiger Apfel'),
  ('off-4104420035768', 'Alnatura Gemüseaufstrich Tomate Basilikum 4104420035768 Bio Brotaufstrich mit Tomate und Basilikum, vegan', 'Alnatura Gemüseaufstrich Tomate Basilikum'),
  ('off-4104420173057', 'Alnatura Gemüsepfanne Art Toskana 4104420173057', 'Alnatura Gemüsepfanne Art Toskana'),
  ('off-4104420225800', 'Alnatura Hafer-Riegel Mandel & Haselnuss 4104420225800 Bio Haferriegel mit Mandeln und Haselnüssen', 'Alnatura Hafer-Riegel Mandel & Haselnuss'),
  ('off-4104420244986', 'Alnatura Haselnuss-Dattel Creme 4104420244986 Bio Haselnuss-Dattel Kakao Creme', 'Alnatura Haselnuss-Dattel Creme'),
  ('off-4104420212794', 'Alnatura Kokoscurry thailändische Art 4104420212794 Bio Curry-Sauce, thailändisch gewürzt', 'Alnatura Kokoscurry thailändische Art'),
  ('off-4104420231658', 'Alnatura Linsenwaffeln 4104420231658 Bio Linsenwaffeln mit Salz, glutenfrei', 'Alnatura Linsenwaffeln'),
  ('off-4104420188174', 'Alnatura Reiswaffeln Rote Bete Apfel 4104420188174 Bio Reiswaffeln mit Rote-Bete-Pulver und Apfelsaftkonzentrat', 'Alnatura Reiswaffeln Rote Bete Apfel'),
  ('off-4104420017764', 'Alnatura Waldbeere Hafer Crunchy 4104420017764 Bio Hafer-Knusper-Müsli', 'Alnatura Waldbeere Hafer Crunchy'),
  ('off-4104420223790', 'Alnatura Zitronen Sorbet (TK) 4104420223790 Sorbet aus dem Saft sizilianischer Zitronen; mit Bergamottöl verfeinert', 'Alnatura Zitronen Sorbet (TK)'),
  ('off-4260546670150', 'Alnavit Zitronenkringel, glutenfrei 4260546670150 Bio Spritzgebäck, mit Hafer.', 'Alnavit Zitronenkringel, glutenfrei'),
  ('off-4012970011791', 'Burger Landknäcke Sesam 4012970011791 Roggenvollkorn-Knäckebrot mit Sesam', 'Burger Landknäcke Sesam'),
  ('off-5760466872102', 'CASTELLO Ananas 5760466872102 Frischkäsezubereitung, wärmebehandelt, Doppelrahmstufe im Milchanteil', 'Castello Ananas Frischkäse'),
  ('off-7613032948191', 'Chokito &lt;mit Knusperreis', 'Chokito mit Knusperreis'),
  ('off-9100000734873', 'Crema mit &quot;Aceto Balsamico di Modena I.G.P.&quot;', 'Crema mit "Aceto Balsamico di Modena I.G.P."'),
  ('off-4056489516408', 'Creme mit &quot;Aceto Balsamico di Modena IGP&quot; Klassik', 'Creme mit "Aceto Balsamico di Modena IGP" Klassik'),
  ('off-7610256600003', 'Die freuden von tante magali 8 törtchen &quot;butter&quot;', 'Die freuden von tante magali 8 törtchen "butter"'),
  ('off-5060517883638', 'Energydrink &quot;Ultra Violet&quot;', 'Energydrink "Ultra Violet"'),
  ('off-4037300108491', 'Erasco Kartoffeltopf mit Würstchen 800g 4037300108491', 'Erasco Kartoffeltopf mit Würstchen'),
  ('off-7640154770010', 'Fondues william wyssmüller &quot;creation&quot; vom master-käse', 'Fondues william wyssmüller "creation" vom master-käse'),
  ('off-4260249144347', 'Freche Freunde Mango & Orange Riegel 4260249144347 Bio-Früchte-Getreide-Riegel', 'Freche Freunde Mango & Orange Riegel'),
  ('off-7617100225320', 'Frikadelle &gt;', 'Frikadelle'),
  ('off-7610900302857', 'Grillkäse &quot;Der scharfe Maxx&quot;', 'Grillkäse "Der scharfe Maxx"'),
  ('off-4071800047812', 'Harry Dinkel Sandwich 4071800047812 Dinkelsandwichbrot', 'Harry Dinkel Sandwich'),
  ('off-4000539221408', 'Hello Strawberry Cheesecake Stick 4000539221408 Gefüllte Vollmilch-Schokolade mit Erdbeer-Quarkcrème (43%) und Gebäckstückchen (2%)', 'Hello Strawberry Cheesecake Stick'),
  ('off-7623186529986', 'High Protein Drin Banane-Erdbeere &quot;zero&quot;', 'High Protein Drink Banane-Erdbeere "zero"'),
  ('off-7610227948677', 'Hilcona Farfalle orientale 7610227948677 Teigwarensalat', 'Hilcona Farfalle orientale Teigwarensalat'),
  ('off-5038862231541', 'Innocent super smoothie &quot;Energise&quot;', 'Innocent super smoothie "Energise"'),
  ('off-7315122030709', 'Kafferep oat biscuits with chocolate 7315122030709 Haferkekse mit Schokolade', 'Kafferep Haferkekse mit Schokolade'),
  ('off-4006952005779', 'Kekse &quot;Coooky&quot;', 'Kekse "Coooky"'),
  ('off-3800233683240', 'Kookie Cat Salted caramel Almond 3800233683240 Bio veganer Keks mit gesalzenes Karamell Mandeln', 'Kookie Cat Salted Caramel Almond'),
  ('off-40804439', 'Kühne Mixed Pickles 40804439 Mixed Pickles', 'Kühne Mixed Pickles'),
  ('off-20203467', 'Lidl Deluxe Cantuccini mit Haselnüssen 20203467 Kekse mit Haselnüssen', 'Lidl Deluxe Cantuccini mit Haselnüssen'),
  ('off-4000539113246', 'Lindt Creation Himbeer Panna Cotta 4000539113246 Vollmilch-Schokolade mit Himbeer-Füllung (9%) auf Sahne-Crème (28%)', 'Lindt Creation Himbeer Panna Cotta'),
  ('off-4281010878001', 'Little Italy 4281010878001 Bio Suppe mit Tomate und Zucchini', 'Little Italy Bio Suppe mit Tomate und Zucchini'),
  ('off-8719200042629', 'Margarine &quot;Unser Meisterstück&quot;, 80% Fett', 'Margarine "Unser Meisterstück", 80% Fett'),
  ('off-7623186371684', 'Margarine mit Butter &quot;Soft&quot;', 'Margarine mit Butter "Soft"'),
  ('off-4000503120102', 'Meica Saft-Bockwurst 4000503120102 Saft-Bockwurst in Eigenhaut', 'Meica Saft-Bockwurst'),
  ('off-4000446016791', 'Mestemacher High Protein Toastbrötchen 4000446016791 Eiweiß Toastbrötchen', 'Mestemacher High Protein Toastbrötchen'),
  ('off-4042116810001', 'Mini-Magdalenas 4042116810001', 'Mini-Magdalenas'),
  ('off-4260311982440', 'MOGLi Zitronen Waffel 15g 4260311982440', 'MOGLi Zitronen Waffel'),
  ('off-7610900024346', 'Molkerei Biedermann Bio Panna Cotta Himbeere Framboise 7610900024346 Bio Panna Cotta mit Himbeerzubereitung, wärmebehandelt', 'Molkerei Biedermann Bio Panna Cotta Himbeere'),
  ('off-7394376617157', 'Oatly Aufstrich Gurke & Knoblauch 7394376617157 Aufstrich auf fermentierter Haferbasis, Gurke & Knoblauch', 'Oatly Aufstrich Gurke & Knoblauch'),
  ('off-8410076471383', 'Old El Paso Vollkorn 8410076471383 Weiche Vollkornweizen-Tortillas', 'Old El Paso Vollkorn-Tortillas'),
  ('off-8412439286917', 'Pan do Mar - Thunfisch Bio-Oliven Pastete 8412439286917', 'Pan do Mar - Thunfisch Bio-Oliven Pastete'),
  ('off-3178530402353', 'Petites Madeleines 3178530402353 Madeleine mit Eiern', 'Petites Madeleines'),
  ('off-3184670006610', 'Rians La Panna Cotta Mango Passion 3184670006610 Milchdessert und Mango', 'Rians La Panna Cotta Mango Passion'),
  ('off-4000417629418', 'RITTER SPORT Kakao-Mousse 4000417629418 Gefüllte Alpen-Vollmilchschokolade mit einer aufgeschlagenen Kakaocreme', 'RITTER SPORT Kakao-Mousse'),
  ('off-7623186629716', 'Schnitzel &quot;Minute&quot;', 'Schnitzel "Minute"'),
  ('off-20002961', 'Schoko-Drink goody cao 20002961 Kakaohaltiges Getränkepulver', 'Schoko-Drink goody cao'),
  ('off-3023470001015', 'St Michel Galettes au bon beurre 3023470001015 Galette mit reiner Butter (Butterkekse)', 'St Michel Galettes au bon beurre')
) as v(id, name, new_name)
where f.id = v.id
  and f.name = v.name;

update public.foods f
set active = false
from (values
  -- -> Kürbissuppe (off-7613312052013)
  ('off-4260614720411', 'Kürbissuppe 4260614720411 Traditionelle Bio-Suppe mit Kürbis, Karotten und Kartoffeln'),
  -- -> Orecchiette (off-20462628)
  ('off-8076809519977', 'Orecchiette -&gt; Nudeln'),
  -- -> Schokolade Weihnachtsmann (off-7616500663596)
  ('off-4008400511528', 'Schokolade &quot;Weihnachtsmann&quot;')
) as v(id, name)
where f.id = v.id
  and f.name = v.name
  and f.active;
