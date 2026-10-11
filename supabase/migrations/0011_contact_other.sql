-- Dialy: third Kontakt category "Sonstiges" (kind 'other'). For these
-- messages food_name holds the subject the sender typed.

alter table public.contact_messages
  drop constraint if exists contact_messages_kind_check;

alter table public.contact_messages
  add constraint contact_messages_kind_check
  check (kind in ('new_food', 'food_fix', 'other'));
