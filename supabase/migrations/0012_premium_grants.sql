-- Dialy: Premium granted by hand in the Dialy-Editor (`npm run editor`, tab
-- "Benutzer"), e.g. for testers or as a goodwill gesture - an account with
-- Premium without a store subscription. One row per account; no row = no
-- grant. expires_at null = unlimited.
--
-- The app reads its own row on every sync (src/services/premium.ts). Users
-- can't write here; editors (public.article_editors, 0006) can.

create table if not exists public.premium_grants (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz,
  note       text not null default '' check (char_length(note) <= 500),
  granted_by uuid default auth.uid() references auth.users (id) on delete set null
);

alter table public.premium_grants enable row level security;

drop policy if exists "premium_grants_read_own" on public.premium_grants;
create policy "premium_grants_read_own" on public.premium_grants
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "premium_grants_editor_read" on public.premium_grants;
create policy "premium_grants_editor_read" on public.premium_grants
  for select to authenticated using (public.is_article_editor());

drop policy if exists "premium_grants_editor_insert" on public.premium_grants;
create policy "premium_grants_editor_insert" on public.premium_grants
  for insert to authenticated with check (public.is_article_editor());

drop policy if exists "premium_grants_editor_update" on public.premium_grants;
create policy "premium_grants_editor_update" on public.premium_grants
  for update to authenticated
  using (public.is_article_editor()) with check (public.is_article_editor());

drop policy if exists "premium_grants_editor_delete" on public.premium_grants;
create policy "premium_grants_editor_delete" on public.premium_grants
  for delete to authenticated using (public.is_article_editor());

grant select, insert, update, delete on public.premium_grants to authenticated;

-- touch_updated_at() from 0006.
drop trigger if exists premium_grants_touch_updated_at on public.premium_grants;
create trigger premium_grants_touch_updated_at
  before update on public.premium_grants
  for each row execute function public.touch_updated_at();

-- All accounts for the editor's user list. auth.users isn't reachable
-- through the API, hence security definer - and editors only.
create or replace function public.editor_users()
returns table (
  user_id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  email_confirmed_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select u.id, u.email::text, u.created_at, u.last_sign_in_at, u.email_confirmed_at
  from auth.users u
  where public.is_article_editor()
  order by u.created_at desc;
$$;

revoke execute on function public.editor_users() from public, anon;
grant execute on function public.editor_users() to authenticated;
