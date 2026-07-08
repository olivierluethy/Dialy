-- Dialy — table privilege grants for the API roles.
--
-- 0001 creates the tables and 0002 enables RLS + owner-only policies, but
-- neither GRANTs table privileges to the PostgREST roles (`anon`,
-- `authenticated`). Without these grants PostgREST rejects every request with
-- 403 "permission denied for table" *before* RLS is even evaluated — so auth'd
-- users could not read or write their own rows and sync failed.
--
-- RLS still enforces row ownership (user_id = auth.uid()); these grants only
-- open the table at the SQL-privilege layer so the policies can do their job.

-- Read-mostly content: world-readable (matches the "articles_read"/"foods_read"
-- policies), never client-writable.
grant select on public.articles to anon, authenticated;
grant select on public.foods    to anon, authenticated;

-- User-owned tables: full CRUD for signed-in users; RLS limits it to own rows.
grant select, insert, update, delete on public.meal_entries  to authenticated;
grant select, insert, update, delete on public.sport_entries to authenticated;
grant select, insert, update, delete on public.bg_readings   to authenticated;
grant select, insert, update, delete on public.profiles      to authenticated;
