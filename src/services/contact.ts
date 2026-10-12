import { getSupabase, isNetworkError } from '@/sync/supabaseClient';
import { getT } from '@/i18n';

/**
 * Kontakt form: messages are written to the Supabase table
 * `contact_messages` (insert-only via RLS). The sender's account is attached
 * by the database when signed in. Nothing is queued offline.
 */

export interface ContactMessage {
  kind: 'new_food' | 'food_fix' | 'other';
  food_name: string; // subject for 'other'
  food_id?: string | null;
  carbs_per_100g?: number | null;
  sugar_per_100g?: number | null;
  fat_per_100g?: number | null;
  message: string;
  app_version?: string | null;
}

/** Why a message could not be sent. */
export type ContactError = 'offline' | 'not-configured' | 'unavailable';

const TIMEOUT_MS = 8000;

export async function sendContactMessage(
  msg: ContactMessage
): Promise<{ ok: true } | { error: ContactError }> {
  const sb = getSupabase();
  if (!sb) return { error: 'not-configured' };
  try {
    // No .select(): senders may not read the table back.
    const reply = await Promise.race([
      sb.from('contact_messages').insert(msg),
      new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), TIMEOUT_MS)),
    ]);
    if (reply === 'timeout') return { error: 'offline' };
    if (reply.error) return { error: isNetworkError(reply.error) ? 'offline' : 'unavailable' };
    return { ok: true };
  } catch (e) {
    return { error: isNetworkError(e) ? 'offline' : 'unavailable' };
  }
}

/** User-facing explanation for a failed send. */
export function contactErrorText(error: ContactError): string {
  switch (error) {
    case 'offline':
      return getT().contact.errorOffline;
    case 'not-configured':
      return getT().contact.errorNotConfigured;
    default:
      return getT().contact.errorUnavailable;
  }
}
