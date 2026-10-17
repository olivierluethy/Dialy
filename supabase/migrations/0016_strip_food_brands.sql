-- Dialy: drop the trailing "(Marke)" from Open Food Facts food names so the
-- KH-Rechner list stays short, e.g. "15 Fischstäbchen (Iglo)" → "15 Fischstäbchen".
--
-- Only off-* rows are touched: there the trailing parenthesis is always the
-- brand. BLS/BLV names use parentheses for descriptions ("… (Pfanne)") and are
-- left alone. The leading piece-count ("15 ") is kept.
--
-- A food can still carry a descriptor paren plus a brand paren
-- ("Fischstäbchen (TK) (Alnatura)"); only the last group is removed.
-- Cleans the German name and the en/fr/it translations in `names`.
-- The foods_touch_updated_at trigger (0010) bumps updated_at, so the app pulls
-- the cleaned rows on its next sync.

-- Removes a single trailing "(…)" group; keeps the original if nothing is left.
create or replace function pg_temp.strip_brand(txt text)
returns text
language sql
immutable
as $$
  select case
    when txt is null then null
    when btrim(regexp_replace(txt, '\s*\([^()]+\)\s*$', '')) = '' then txt
    else btrim(regexp_replace(txt, '\s*\([^()]+\)\s*$', ''))
  end;
$$;

update public.foods f
set
  name = pg_temp.strip_brand(f.name),
  names = (
    select coalesce(jsonb_object_agg(e.key, pg_temp.strip_brand(e.value)), '{}'::jsonb)
    from jsonb_each_text(f.names) e
  )
where f.id like 'off-%'
  and f.name ~ '\([^()]+\)\s*$';
