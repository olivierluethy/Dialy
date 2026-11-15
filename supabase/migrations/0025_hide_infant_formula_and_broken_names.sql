-- Dialy: hide entries that are not useful foods in the KH-Rechner:
-- Open Food Facts rows with broken names ("Angeln" is a Granini drink) and
-- infant formula / follow-on / toddler milk (Aptamil, Beba, HiPP, Holle, ...).
-- Baby cereals, purées and snacks stay visible.
--
-- 47 foods get active = false; nothing is deleted. A row is only touched
-- if its name is still the listed one. The foods_touch_updated_at trigger
-- (0010) bumps updated_at, so the app drops them on its next sync.

update public.foods f
set active = false
from (values
  -- Broken names without meaning
  ('off-7610235006765', 'Angeln'),
  ('off-3564700332634', 'Fresh tea Angeln'),
  -- Infant formula, follow-on and toddler milk
  ('off-4031244700698', 'Humana SL'),
  ('off-4056631001639', 'APTAMIL PEPTI SYNEO Spezialnahrung'),
  ('off-4056631001950', 'Aptamil Pronatura - Advance Anfangsmilch PRE'),
  ('off-4056631002414', 'Aptamil Pronutra Anfangsmilch Pre trinkfertig'),
  ('off-4062300167704', 'BIO Combiotik nach dem Vorbild der Natur 2 Bio-Folgemilch'),
  ('off-4062300167735', 'BIO Combiotik nach dem Vorbild der Natur 3 Bio-Folgemilch'),
  ('off-4062300244276', 'Kindermilch Combiotik'),
  ('off-4104420176690', 'Anfangs Milch'),
  ('off-4104420176881', 'Folgemilch'),
  ('off-7611471002207', 'Aptamil verringert das Risiko von Allergien'),
  ('off-7611471002467', 'Aptamil Pronutra 1'),
  ('off-7611471002474', 'Aptamil Pronutra Fagermilch'),
  ('off-7611471002481', 'Aptamil Pronutra 3'),
  ('off-7611471002566', 'Aptamil Pronutra Junior 18+ Vanille'),
  ('off-7611471003211', 'Aptamil Pronutra Junior 12+'),
  ('off-7611471003396', 'Aptamil Pronutra'),
  ('off-7611471003785', 'Aptamil Für Babybäuchlein mit sensibler Verdauung'),
  ('off-7611471003792', 'Aptamil'),
  ('off-7611471003808', 'Aptamil Pronutra Pre'),
  ('off-7611471003815', 'Aptamil Ha Pre'),
  ('off-7611471004096', 'Milumil 2 Folgemilch'),
  ('off-7611471004805', 'APTAMIL AR ANTI-REFLUX 1 Spezialnahrung'),
  ('off-7611471004812', 'APTAMIL AR ANTI-REFLUX 2 Spezialnahrung'),
  ('off-7611471004874', 'APTAMIL CONFORT 1 Spezialnahrung'),
  ('off-7611471004898', 'APTAMIL CONFORT 2 Spezialnahrung'),
  ('off-7613032565817', 'Junior Milk 12+'),
  ('off-7613034031358', 'Beba Junior 12+ Falgemilch'),
  ('off-7613034038258', 'Beba Junior 18+'),
  ('off-7613034038296', 'Junior Milk 18+'),
  ('off-7613035124561', 'Beba zur zwiemilchernährung zum abstillen'),
  ('off-7613035149182', 'Beba Comfortis Anfangsmilch'),
  ('off-7613035149366', 'Beba Comforts Folgemilch'),
  ('off-7613035155596', 'Beba 3'),
  ('off-7613035155626', 'Beba 1'),
  ('off-7613035188822', 'Beba mit Calcium & Vitamin D fur eine gesunde Entwicklung'),
  ('off-7613035269538', 'BEBA DIGEST Spezial-Säuglingsmilchnahrung bei leichter Verstopfung'),
  ('off-7613035269750', 'BEBA Optipro HA 2 Für allergiegefährdete Babies - Hypoallergen'),
  ('off-7613035269781', 'Beba Ha Start Pre'),
  ('off-7613035269859', 'Beba sensitive ab geburt'),
  ('off-7613035269873', 'Beba AR Spezial- Säuglingsnahrung anti-reflux'),
  ('off-7613035269897', 'Beba Ha 3'),
  ('off-7613035273504', 'Beba Ha 1'),
  ('off-7613035574038', 'Beba comfortis junior für''s sensible bäuchlein'),
  ('off-7613036218047', 'Beba Bio 2'),
  ('off-7640230491082', 'Bio-Anfangsmilch 1')
) as v(id, name)
where f.id = v.id
  and f.name = v.name
  and f.active;
