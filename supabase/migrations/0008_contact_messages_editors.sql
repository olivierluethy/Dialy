-- Dialy: editors (public.article_editors, 0006) read the Kontakt messages in
-- the editor (`npm run editor`, tab "Nachrichten") and mark them as handled.
-- Senders still can't read anything back.

drop policy if exists "contact_messages_editor_read" on public.contact_messages;
create policy "contact_messages_editor_read" on public.contact_messages
  for select to authenticated using (public.is_article_editor());

drop policy if exists "contact_messages_editor_update" on public.contact_messages;
create policy "contact_messages_editor_update" on public.contact_messages
  for update to authenticated
  using (public.is_article_editor()) with check (public.is_article_editor());

grant select on public.contact_messages to authenticated;
-- Editors may only toggle "handled", not change what was sent.
grant update (handled_at) on public.contact_messages to authenticated;

-- E-mail addresses of the senders, for replying. auth.users isn't reachable
-- through the API, hence security definer - and editors only.
create or replace function public.contact_message_senders()
returns table (user_id uuid, email text)
language sql
stable
security definer
set search_path = ''
as $$
  select u.id, u.email::text
  from auth.users u
  where public.is_article_editor()
    and u.id in (select m.user_id from public.contact_messages m);
$$;

revoke execute on function public.contact_message_senders() from public, anon;
grant execute on function public.contact_message_senders() to authenticated;
