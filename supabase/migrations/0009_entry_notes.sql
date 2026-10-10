-- Dialy: free-text comment per diary entry (Tagebuch, edit popup). Mirrors
-- local schema version 4 (src/db/schema.ts).
--
-- Run this before using an app version with comments: sync pushes whole
-- rows, so without the column every push of a diary entry fails.

alter table public.meal_entries
  add column if not exists note text check (char_length(note) <= 500);

alter table public.sport_entries
  add column if not exists note text check (char_length(note) <= 500);
