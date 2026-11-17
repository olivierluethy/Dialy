-- Dialy: drop doubled words that 0032 left in food names. The BLS lists
-- synonyms side by side ("Karotte/Möhre", "Rahmeis/Sahneeis",
-- "(Sahnepulver, Rahmpulver)"); converted to one variant both sides are the
-- same word ("Karotte/Karotte"), so it is kept once:
--   "Karotte/Karotte, roh"             -> "Karotte, roh"
--   "Karotten-/Karottenpüree"          -> "Karottenpüree"
--   "Rahmglace/Rahmglace"              -> "Rahmglace"
--   "(Rahmpulver, Rahmpulver)"         -> "(Rahmpulver)"
-- in the Swiss name (`name`) as well as in names['de-DE']
-- ("Schweineohren/Schweineohren" -> "Schweineohren"). A few BLS names had
-- such a repeat from the start ("Lyoner/Lyoner Wurst" -> "Lyoner Wurst",
-- "Tiroler/Tiroler Schinkenwurst" -> "Tiroler Schinkenwurst").
-- scripts/lib/germanVariants.mjs does the same from now on.
--
-- 35 foods. Only curated and imported foods are touched, and only if
-- their name is still the listed one, so later edits in the Dialy-Editor are
-- not overwritten. The foods_touch_updated_at trigger
-- (0010) bumps updated_at, so the app picks the changes up on its next sync.

update public.foods f
set
  name = v.new_name,
  names = case
    when v.name_de is null then f.names - 'de-DE'
    else f.names || jsonb_build_object('de-DE', v.name_de)
  end
from (values
  ('bls-W368000', 'Anspacher Leberpresssack/Leberpresssack', 'Anspacher Leberpresssack', null),
  ('bls-W251000', 'Bayrische Bierwurst/Bierwurst Ia', 'Bayrische Bierwurst Ia', null),
  ('bls-G620600', 'Gemüsesaft aus Karotte/Karotte', 'Gemüsesaft aus Karotte', 'Gemüsesaft aus Karotte/Möhre'),
  ('bls-G622600', 'Gemüsesaft aus Karotte/Karotte, mit Honig', 'Gemüsesaft aus Karotte, mit Honig', 'Gemüsesaft aus Karotte/Möhre, mit Honig'),
  ('bls-G620162', 'Karotte/Karotte, gebacken', 'Karotte, gebacken', 'Karotte/Möhre, gebacken'),
  ('bls-G620182', 'Karotte/Karotte, gebraten ohne Fett (Pfanne)', 'Karotte, gebraten ohne Fett (Pfanne)', 'Karotte/Möhre, gebraten ohne Fett (Pfanne)'),
  ('bls-G620152', 'Karotte/Karotte, gedünstet', 'Karotte, gedünstet', 'Karotte/Möhre, gedünstet'),
  ('bls-G620132', 'Karotte/Karotte, gekocht', 'Karotte, gekocht', 'Karotte/Möhre, gekocht'),
  ('bls-G620802', 'Karotte/Karotte, gesäuert, abgetropft', 'Karotte, gesäuert, abgetropft', 'Karotte/Möhre, gesäuert, abgetropft'),
  ('bls-G620142', 'Karotte/Karotte, geschmort ohne Fett', 'Karotte, geschmort ohne Fett', 'Karotte/Möhre, geschmort ohne Fett'),
  ('bls-G620902', 'Karotte/Karotte, Konserve, abgetropft', 'Karotte, Konserve, abgetropft', 'Karotte/Möhre, Konserve, abgetropft'),
  ('bls-G620100', 'Karotte/Karotte, roh', 'Karotte, roh', 'Karotte/Möhre, roh'),
  ('bls-G620200', 'Karotte/Karotte, tiefgefroren', 'Karotte, tiefgefroren', 'Karotte/Möhre, tiefgefroren'),
  ('bls-G620262', 'Karotte/Karotte, tiefgefroren, gebacken', 'Karotte, tiefgefroren, gebacken', 'Karotte/Möhre, tiefgefroren, gebacken'),
  ('bls-G620282', 'Karotte/Karotte, tiefgefroren, gebraten ohne Fett (Pfanne)', 'Karotte, tiefgefroren, gebraten ohne Fett (Pfanne)', 'Karotte/Möhre, tiefgefroren, gebraten ohne Fett (Pfanne)'),
  ('bls-G620252', 'Karotte/Karotte, tiefgefroren, gedünstet', 'Karotte, tiefgefroren, gedünstet', 'Karotte/Möhre, tiefgefroren, gedünstet'),
  ('bls-G620232', 'Karotte/Karotte, tiefgefroren, gekocht', 'Karotte, tiefgefroren, gekocht', 'Karotte/Möhre, tiefgefroren, gekocht'),
  ('bls-G620242', 'Karotte/Karotte, tiefgefroren, geschmort ohne Fett', 'Karotte, tiefgefroren, geschmort ohne Fett', 'Karotte/Möhre, tiefgefroren, geschmort ohne Fett'),
  ('bls-X562463', 'Karotten-/Karottenpüree', 'Karottenpüree', 'Karotten-/Möhrenpüree'),
  ('bls-X562043', 'Karotten/Karotten, gedünstet (mit Fett und Salz)', 'Karotten, gedünstet (mit Fett und Salz)', 'Karotten/Möhren, gedünstet (mit Fett und Salz)'),
  ('bls-X5A9000', 'Karotten/Karotten, gekocht', 'Karotten, gekocht', 'Karotten/Möhren, gekocht'),
  ('bls-X562013', 'Karotten/Karotten, gekocht, gebraten', 'Karotten, gekocht, gebraten', 'Karotten/Möhren, gekocht, gebraten'),
  ('bls-X562063', 'Karotten/Karotten, gekocht, in Butter geschwenkt', 'Karotten, gekocht, in Butter geschwenkt', 'Karotten/Möhren, gekocht, in Butter geschwenkt'),
  ('bls-X562053', 'Karotten/Karotten, gekocht, mit Grundsauce hell/weiss', 'Karotten, gekocht, mit Grundsauce hell/weiss', 'Karotten/Möhren, gekocht, mit Grundsauce hell/weiß'),
  ('bls-W231100', 'Lyoner/Lyoner Wurst', 'Lyoner Wurst', null),
  ('bls-W870400', 'Lyoner/Lyoner Wurst, Konserve', 'Lyoner Wurst, Konserve', null),
  ('bls-M881000', 'Milchpulver mit hohem Fettgehalt (Rahmpulver, Rahmpulver)', 'Milchpulver mit hohem Fettgehalt (Rahmpulver)', 'Milchpulver mit hohem Fettgehalt (Sahnepulver, Rahmpulver)'),
  ('bls-P330000', 'Perlwein/Perlwein mit zugesetzer Kohlensäure, trocken', 'Perlwein mit zugesetzer Kohlensäure, trocken', null),
  ('bls-S230000', 'Rahmglace/Rahmglace', 'Rahmglace', 'Sahneeis'),
  ('bls-M172500', 'Sauerrahm/Sauerrahm, mind. 10 % Fett', 'Sauerrahm, mind. 10 % Fett', 'Sauerrahm/Saure Sahne, mind. 10 % Fett'),
  ('bls-W163100', 'Schinkenplockwurst/Schinkenplockwurst luftgetrocknet', 'Schinkenplockwurst luftgetrocknet', null),
  ('bls-D770300', 'Schweineohren/Schweinsohren (Blätterteig)', 'Schweineohren/Schweinsohren (Blätterteig)', 'Schweineohren (Blätterteig)'),
  ('bls-R143000', 'Sojasauce/Sojasauce', 'Sojasauce', 'Sojasauce/Sojasoße'),
  ('bls-W112200', 'Streichmettwurst/Streichmettwurst mit Zwiebeln', 'Streichmettwurst mit Zwiebeln', null),
  ('bls-W253200', 'Tiroler/Tiroler Schinkenwurst', 'Tiroler Schinkenwurst', null)
) as v(id, name, new_name, name_de)
where f.id = v.id
  and f.name = v.name
  and f.user_id is null;
