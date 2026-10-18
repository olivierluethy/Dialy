// Dexcom OAuth + import boundary. This is an Edge Function because the client
// must never receive a Dexcom client secret, refresh token, or service key.
// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Content-Type': 'application/json' };
const appUrl = Deno.env.get('DEXCOM_APP_REDIRECT') ?? 'dialy://dexcom/complete';
const baseUrl = Deno.env.get('DEXCOM_BASE_URL') ?? 'https://sandbox-api.dexcom.com';
const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/dexcom`;
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: cors });
const redirect = (status: string) => Response.redirect(`${appUrl}?status=${encodeURIComponent(status)}`, 302);

async function currentUser(req: Request) {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data } = await admin.auth.getUser(token);
  return data.user ?? null;
}

function key(): Uint8Array {
  const value = Deno.env.get('DEXCOM_TOKEN_ENCRYPTION_KEY');
  if (!value) throw new Error('Dexcom token encryption is not configured.');
  const bytes = Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
  if (bytes.length !== 32) throw new Error('DEXCOM_TOKEN_ENCRYPTION_KEY must be a base64 32-byte key.');
  return bytes;
}
async function encrypt(value: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cryptoKey = await crypto.subtle.importKey('raw', key(), 'AES-GCM', false, ['encrypt']);
  const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, new TextEncoder().encode(value));
  return { ciphertext: btoa(String.fromCharCode(...new Uint8Array(data))), iv: btoa(String.fromCharCode(...iv)) };
}
async function decrypt(ciphertext: string, iv: string) {
  const cryptoKey = await crypto.subtle.importKey('raw', key(), 'AES-GCM', false, ['decrypt']);
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: Uint8Array.from(atob(iv), (c) => c.charCodeAt(0)) }, cryptoKey,
    Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0))
  );
  return new TextDecoder().decode(plain);
}

async function tokenRequest(values: URLSearchParams) {
  const response = await fetch(`${baseUrl}/v2/oauth2/token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: values });
  if (!response.ok) throw new Error(`Dexcom authorization failed (${response.status}).`);
  return response.json();
}

async function callback(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state) return redirect('failed');
  const { data: connection } = await admin.from('dexcom_connections').select('*').eq('authorization_state', state).maybeSingle();
  if (!connection || new Date(connection.state_expires_at).getTime() < Date.now()) return redirect('expired');
  try {
    const tokens = await tokenRequest(new URLSearchParams({
      grant_type: 'authorization_code', code, redirect_uri: callbackUrl,
      client_id: Deno.env.get('DEXCOM_CLIENT_ID')!, client_secret: Deno.env.get('DEXCOM_CLIENT_SECRET')!,
    }));
    const access = await encrypt(tokens.access_token);
    const refresh = await encrypt(tokens.refresh_token);
    await admin.from('dexcom_connections').update({
      access_token_ciphertext: access.ciphertext, refresh_token_ciphertext: refresh.ciphertext, token_iv: access.iv, refresh_token_iv: refresh.iv,
      expires_at: new Date(Date.now() + Number(tokens.expires_in) * 1000).toISOString(), authorization_state: null,
      state_expires_at: null, connected_at: new Date().toISOString(), last_error: null, updated_at: new Date().toISOString(),
    }).eq('user_id', connection.user_id);
    return redirect('connected');
  } catch (error) {
    await admin.from('dexcom_connections').update({ last_error: String(error), updated_at: new Date().toISOString() }).eq('user_id', connection.user_id);
    return redirect('failed');
  }
}

async function freshAccess(connection: any) {
  if (new Date(connection.expires_at).getTime() > Date.now() + 60_000) return decrypt(connection.access_token_ciphertext, connection.token_iv);
  const refreshToken = await decrypt(connection.refresh_token_ciphertext, connection.refresh_token_iv);
  const tokens = await tokenRequest(new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken, client_id: Deno.env.get('DEXCOM_CLIENT_ID')!, client_secret: Deno.env.get('DEXCOM_CLIENT_SECRET')! }));
  const access = await encrypt(tokens.access_token); const refresh = await encrypt(tokens.refresh_token ?? refreshToken);
  await admin.from('dexcom_connections').update({ access_token_ciphertext: access.ciphertext, refresh_token_ciphertext: refresh.ciphertext, token_iv: access.iv, refresh_token_iv: refresh.iv, expires_at: new Date(Date.now() + Number(tokens.expires_in) * 1000).toISOString(), updated_at: new Date().toISOString() }).eq('user_id', connection.user_id);
  return tokens.access_token;
}

async function sync(userId: string) {
  const { data: connection } = await admin.from('dexcom_connections').select('*').eq('user_id', userId).maybeSingle();
  if (!connection?.access_token_ciphertext) throw new Error('No Dexcom account is connected.');
  const accessToken = await freshAccess(connection);
  const start = connection.last_synced_at ?? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const end = new Date().toISOString();
  const response = await fetch(`${baseUrl}/v2/users/self/egvs?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!response.ok) throw new Error(`Dexcom data request failed (${response.status}).`);
  const payload = await response.json();
  const records = Array.isArray(payload.records) ? payload.records : [];
  const rows = records
    .filter((r: any) => typeof r.value === 'number' && r.systemTime)
    .map((r: any) => ({ user_id: userId, value_mmol: r.unit === 'mg/dL' ? r.value / 18.0182 : r.value, source: 'cgm', logged_at: r.systemTime, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), deleted_at: null }));
  if (rows.length) await admin.from('bg_readings').upsert(rows, { onConflict: 'user_id,logged_at,source', ignoreDuplicates: true });
  await admin.from('dexcom_connections').update({ last_synced_at: end, last_error: null, updated_at: end }).eq('user_id', userId);
  return rows.length;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'GET') return callback(req);
  const user = await currentUser(req); if (!user) return json({ error: 'Unauthorised' }, 401);
  try {
    const { action } = await req.json();
    if (action === 'status') { const { data } = await admin.from('dexcom_connections').select('connected_at,last_synced_at,last_error').eq('user_id', user.id).maybeSingle(); return json({ connected: Boolean(data?.connected_at), lastSyncedAt: data?.last_synced_at ?? null, error: data?.last_error ?? null }); }
    if (action === 'connect') { const state = crypto.randomUUID(); await admin.from('dexcom_connections').upsert({ user_id: user.id, authorization_state: state, state_expires_at: new Date(Date.now() + 10 * 60_000).toISOString(), updated_at: new Date().toISOString() }); const q = new URLSearchParams({ client_id: Deno.env.get('DEXCOM_CLIENT_ID')!, redirect_uri: callbackUrl, response_type: 'code', scope: 'offline_access', state }); return json({ authorizationUrl: `${baseUrl}/v2/oauth2/login?${q}` }); }
    if (action === 'sync') return json({ imported: await sync(user.id) });
    if (action === 'disconnect') { await admin.from('dexcom_connections').delete().eq('user_id', user.id); return json({ disconnected: true }); }
    return json({ error: 'Unknown action' }, 400);
  } catch (error) { return json({ error: String(error) }, 400); }
});
