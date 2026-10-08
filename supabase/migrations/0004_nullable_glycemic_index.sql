-- Dialy — glycaemic index becomes optional.
--
-- Foods from the Swiss Food Composition Database (BLV) carry no glycaemic
-- index, so meals built from them have none either. Mirrors local schema
-- version 2 (src/db/schema.ts).

alter table public.foods alter column glycemic_index drop not null;
alter table public.meal_entries alter column glycemic_index drop not null;
