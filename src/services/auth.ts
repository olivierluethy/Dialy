import { getSupabase } from '@/sync/supabaseClient';
import { softDeleteAllUserData } from '@/db/repositories/userData';
import { localAuth } from '@/services/localAuth';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
  /** Non-error hint, e.g. "check your inbox" after a sign-up needing confirmation. */
  notice?: string;
}

const SYNC_TABLES = [
  'meal_entries',
  'sport_entries',
  'bg_readings',
] as const;

/**
 * Auth + account service backed by Supabase Auth (email + password, JWT).
 *
 * When Supabase isn't configured, every method transparently falls back to a
 * local, on-device account store (services/localAuth.ts) so registration and
 * login work fully offline — the account-gated feature (Tagebuch) is
 * usable with zero backend setup. Configuring Supabase is preferred and takes
 * over automatically (it enables cross-device sync); until then the local
 * store keeps everything on the device.
 */
export const authService = {
  isConfigured(): boolean {
    return getSupabase() !== null;
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    const sb = getSupabase();
    if (!sb) return localAuth.signIn(email, password);
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: translateAuthError(error.message) };
    return { user: toUser(data.user), error: null };
  },

  async signUp(email: string, password: string): Promise<AuthResult> {
    const sb = getSupabase();
    if (!sb) return localAuth.signUp(email, password);
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) return { user: null, error: translateAuthError(error.message) };
    // An already registered address gets a user without identities and no
    // error (Supabase doesn't reveal existing accounts that way).
    if (data.user && data.user.identities?.length === 0) {
      return { user: null, error: 'Diese E-Mail ist bereits registriert. Bitte melde dich an.' };
    }
    // With "Confirm email" enabled there's no session until the link is clicked.
    if (!data.session) {
      return {
        user: null,
        error: null,
        notice:
          `Fast geschafft! Wir haben dir eine E-Mail an ${email} geschickt. Bitte ` +
          'bestätige deine Adresse über den Link darin und melde dich danach an.',
      };
    }
    return { user: toUser(data.user), error: null };
  },

  async signOut(): Promise<void> {
    const sb = getSupabase();
    if (!sb) return localAuth.signOut();
    await sb.auth.signOut();
  },

  async currentUser(): Promise<AuthUser | null> {
    const sb = getSupabase();
    if (!sb) return localAuth.currentUser();
    const { data } = await sb.auth.getUser();
    return toUser(data.user);
  },

  /**
   * Privacy: erase all of the user's data. Soft-deletes locally (so the
   * deletion syncs out and can't resurface), then issues matching deletes on
   * Supabase. Best-effort on the server; local deletion always succeeds.
   */
  async deleteAccountData(userId: string): Promise<{ error: string | null }> {
    await softDeleteAllUserData(userId);
    const sb = getSupabase();
    if (!sb) return { error: null }; // offline-only: local deletion is enough
    try {
      const ts = new Date().toISOString();
      for (const table of SYNC_TABLES) {
        // supabase-js reports failures in `error` instead of throwing.
        const { error } = await sb
          .from(table)
          .update({ deleted_at: ts, updated_at: ts })
          .eq('user_id', userId);
        if (error) return { error: error.message };
      }
      return { error: null };
    } catch (e) {
      return { error: String(e) };
    }
  },
};

function toUser(user: { id: string; email?: string | null } | null): AuthUser | null {
  if (!user) return null;
  return { id: user.id, email: user.email ?? '' };
}

/** Map common Supabase auth errors to simple Swiss-German copy. */
function translateAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login')) return 'E-Mail oder Passwort ist falsch.';
  if (m.includes('already registered')) return 'Diese E-Mail ist bereits registriert.';
  if (m.includes('email not confirmed')) {
    return 'Bitte bestätige zuerst deine E-Mail-Adresse (Link in der Bestätigungs-Mail) und melde dich dann an.';
  }
  if (m.includes('rate limit')) return 'Zu viele Versuche. Bitte warte einen Moment und versuche es erneut.';
  if (m.includes('password')) return 'Das Passwort erfüllt die Anforderungen nicht (mind. 6 Zeichen).';
  if (m.includes('email')) return 'Bitte gib eine gültige E-Mail-Adresse ein.';
  return 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.';
}
