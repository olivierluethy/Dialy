-- Dexcom OAuth credentials are never available to the mobile client.
-- The Edge Function encrypts token material with an AES-GCM key held only in
-- Supabase secrets before it is written here.
create table if not exists public.dexcom_connections (
  user_id uuid primary key references auth.users(id) on delete cascade,
  access_token_ciphertext text,
  refresh_token_ciphertext text,
  token_iv text,
  refresh_token_iv text,
  expires_at timestamptz,
  authorization_state uuid unique,
  state_expires_at timestamptz,
  connected_at timestamptz,
  last_synced_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.dexcom_connections enable row level security;
-- Deliberately no client policies: only the authenticated Edge Function with
-- the service-role key can see encrypted tokens or connection metadata.

-- A regular unique index is deliberately used (rather than a partial index)
-- so PostgREST's `onConflict=user_id,logged_at,source` can use it during the
-- import upsert. Manual and CGM values may still coexist at one timestamp.
create unique index if not exists bg_readings_source_timestamp_unique
  on public.bg_readings(user_id, logged_at, source);
