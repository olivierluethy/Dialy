# Dialy setup guide

Dialy works offline without external configuration. The steps below enable account sync, Google sign-in, and Dexcom import. Never expose a service-role key, OAuth secret, refresh token, or encryption key through `EXPO_PUBLIC_*` values.

## Supabase baseline

1. Create a project and run `supabase db push`.
2. Set `EXPO_PUBLIC_SUPABASE_URL` (for example `https://project-ref.supabase.co`) and `EXPO_PUBLIC_SUPABASE_ANON_KEY` (`eyJ...`) in the app build environment.
3. Add `dialy://auth/callback` and the deployed web URL in Supabase Authentication → URL Configuration → Redirect URLs.

## Google Authentication

Dialy uses Supabase Auth’s Google OAuth authorization-code flow. No Google secret is shipped in the app.

1. In Google Cloud Console configure the consent screen and create a **Web application** OAuth client.
2. Add exactly `https://<project-ref>.supabase.co/auth/v1/callback` as its authorised redirect URI.
3. In Supabase Authentication → Providers → Google, enable Google and enter that client’s ID and secret.
4. Start Dialy and choose **Continue with Google**. The browser returns to `dialy://auth/callback`; `src/services/auth.ts` exchanges the code for a session.

For `redirect_uri_mismatch`, compare the Google URI character-for-character. If Dialy does not reopen, ensure `scheme: 'dialy'` remains in `app.config.ts` and the deep link is allow-listed by Supabase.

## Dexcom integration

The server-side implementation is `supabase/functions/dexcom/index.ts`; mobile clients never receive Dexcom credentials or refresh tokens.

1. Register with Dexcom Developer and obtain sandbox access. Production access, supported regions, and scopes require Dexcom approval.
2. Configure this Dexcom callback URL: `https://<project-ref>.supabase.co/functions/v1/dexcom`.
3. Add these Supabase Edge Function secrets:

| Secret | Purpose | Safe example |
| --- | --- | --- |
| `DEXCOM_CLIENT_ID` | Dexcom OAuth client ID | `abc123` |
| `DEXCOM_CLIENT_SECRET` | Dexcom OAuth secret | external secret |
| `DEXCOM_TOKEN_ENCRYPTION_KEY` | Base64 random 32-byte AES key | `openssl rand -base64 32` |
| `DEXCOM_BASE_URL` | Sandbox/production API host | `https://sandbox-api.dexcom.com` |
| `DEXCOM_APP_REDIRECT` | Return deep link | `dialy://dexcom/complete` |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are runtime secrets. Do not add them to Expo config.

4. Apply `0015_dexcom_connections.sql` and deploy with `supabase functions deploy dexcom --no-verify-jwt`. The callback lacks a Supabase JWT; the function validates JWTs itself for every app request.
5. In Settings → Devices, connect Dexcom, complete authorization, then choose Sync now. Only returned Dexcom records are imported; mg/dL is converted to mmol/L, timestamps are preserved, and `(user, timestamp, cgm)` duplicates are ignored.

`expired` means the ten-minute connection state expired. API 400/403 commonly means callback mismatch, missing approval, wrong region, or unavailable sandbox credentials. Production is not verified by this repository.

## Optional existing configuration

`EXPO_PUBLIC_SENTRY_DSN`, `EXPO_PUBLIC_FEATURE_FCM`, and `EXPO_PUBLIC_FEATURE_HEALTH` remain optional. The native HealthKit/Health Connect bridge is still not implemented; enabling its flag does not create a device integration.
