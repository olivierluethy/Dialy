-- Dialy: messages from the Kontakt form (suggest a new food / report a wrong
-- one). Anyone may send, nobody can read them through the API - read them in
-- the Table Editor or SQL Editor:
--
--   select m.created_at, m.kind, m.food_name, m.message, u.email
--   from public.contact_messages m left join auth.users u on u.id = m.user_id
--   order by m.created_at desc;

create table if not exists public.contact_messages (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  -- Sender's account when signed in (filled from the JWT), else null.
  user_id        uuid default auth.uid() references auth.users (id) on delete set null,
  kind           text not null check (kind in ('new_food', 'food_fix')),
  food_name      text not null check (char_length(food_name) between 1 and 200),
  food_id        text check (char_length(food_id) <= 100), -- food_fix only
  carbs_per_100g numeric check (carbs_per_100g between 0 and 100),
  sugar_per_100g numeric check (sugar_per_100g between 0 and 100),
  fat_per_100g   numeric check (fat_per_100g between 0 and 100),
  message        text not null default '' check (char_length(message) <= 4000),
  app_version    text check (char_length(app_version) <= 40),
  -- For you: set once a message is dealt with.
  handled_at     timestamptz
);

alter table public.contact_messages enable row level security;

-- Insert only, and only as yourself (or anonymously).
drop policy if exists "contact_messages_insert" on public.contact_messages;
create policy "contact_messages_insert" on public.contact_messages
  for insert to anon, authenticated
  with check (handled_at is null and (user_id is null or user_id = auth.uid()));

grant insert on public.contact_messages to anon, authenticated;
