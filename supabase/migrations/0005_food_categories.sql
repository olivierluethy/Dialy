-- Dialy — top-level food categories (KH-Rechner filter).
--
-- ";"-separated category names (Swiss Food Composition Database). Mirrors
-- local schema version 3 (src/db/schema.ts).

alter table public.foods add column if not exists categories text not null default '';
