-- Dialy: Ratgeber articles editable by approved editors (article editor,
-- `npm run editor`). Everyone else keeps read-only access.
--
-- Make an account an editor (SQL Editor, once per person):
--   insert into public.article_editors (user_id)
--   select id from auth.users where email = '<email>';

create table if not exists public.article_editors (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.article_editors enable row level security;

-- Editors can see that they are editors (the editor checks this after login).
drop policy if exists "article_editors_read_own" on public.article_editors;
create policy "article_editors_read_own" on public.article_editors
  for select to authenticated using (user_id = auth.uid());

grant select on public.article_editors to authenticated;

-- security definer: the policies below may look up the table without the
-- caller needing access to other editors' rows.
create or replace function public.is_article_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.article_editors where user_id = auth.uid());
$$;

revoke execute on function public.is_article_editor() from public, anon;
grant execute on function public.is_article_editor() to authenticated;

-- Insert and update only; articles are removed by setting deleted_at.
drop policy if exists "articles_insert_editor" on public.articles;
create policy "articles_insert_editor" on public.articles
  for insert to authenticated with check (public.is_article_editor());

drop policy if exists "articles_update_editor" on public.articles;
create policy "articles_update_editor" on public.articles
  for update to authenticated
  using (public.is_article_editor()) with check (public.is_article_editor());

grant insert, update on public.articles to authenticated;

-- Keep updated_at current on every edit.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists articles_touch_updated_at on public.articles;
create trigger articles_touch_updated_at
  before update on public.articles
  for each row execute function public.touch_updated_at();
