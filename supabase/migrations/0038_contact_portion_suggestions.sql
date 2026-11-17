-- Dialy: report a wrong food and suggest a portion size right on the food in
-- the KH-Rechner (instead of the Kontakt form). Error reports stay kind
-- 'food_fix'; portion suggestions are the new kind 'portion' with the
-- suggested label and grams in their own columns, so the Dialy-Editor can
-- add them to the food with one click (tab "Nachrichten").

alter table public.contact_messages
  add column if not exists portion_label text check (char_length(portion_label) between 1 and 80),
  add column if not exists portion_grams numeric check (portion_grams > 0 and portion_grams <= 2000);

alter table public.contact_messages
  drop constraint if exists contact_messages_kind_check;
alter table public.contact_messages
  add constraint contact_messages_kind_check
  check (kind in ('new_food', 'food_fix', 'portion', 'other'));

-- A portion suggestion names the food and has both values.
alter table public.contact_messages
  drop constraint if exists contact_messages_portion_check;
alter table public.contact_messages
  add constraint contact_messages_portion_check
  check (kind <> 'portion' or (food_id is not null and portion_label is not null and portion_grams is not null));
