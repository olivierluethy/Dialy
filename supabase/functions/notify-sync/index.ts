// Supabase Edge Function (Deno) — STUB, not required for local run.
//
// Purpose (see §7 sync contract): when a user's data changes on the server,
// notify their other devices via FCM so they pull — NO client polling. A DB
// webhook / trigger on meal_entries/sport_entries/bg_readings would call this.
//
// This is intentionally a thin, structured stub. It does not need to be
// deployed for the app to run locally (FCM is gated behind a feature flag and
// the client falls back to sync-on-foreground + manual sync).
//
// Deploy later with:  supabase functions deploy notify-sync
//
// deno-lint-ignore-file no-explicit-any
// @ts-nocheck  (Deno runtime types are not part of the RN/Expo tsconfig.)

interface ChangePayload {
  user_id: string;
  table: string;
}

Deno.serve(async (req: Request) => {
  try {
    const payload = (await req.json()) as ChangePayload;

    // TODO(server): look up the user's FCM tokens and send a data-only push:
    //   { type: 'dialy.sync', table: payload.table }
    // using the FCM HTTP v1 API and a service account (server-side secret —
    // NEVER shipped to the client).
    //
    // const tokens = await getUserFcmTokens(payload.user_id)
    // await sendDataMessage(tokens, { type: 'dialy.sync', table: payload.table })

    return new Response(
      JSON.stringify({ ok: true, notified: payload.user_id }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
