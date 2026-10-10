import { getSupabase, isNetworkError } from '@/sync/supabaseClient';
import type { Article, DiabetesType } from '@/types/models';

/**
 * Ratgeber articles, maintained centrally in Supabase (table `articles`,
 * world-readable via RLS). They are read live and deliberately not stored on
 * the device: offline, the Ratgeber simply shows no articles.
 */

/** Why no articles could be loaded. */
export type ArticlesError = 'offline' | 'not-configured' | 'unavailable';
export type ArticlesResult<T> = { data: T } | { error: ArticlesError };

// Give up on a slow / missing connection after this long.
const TIMEOUT_MS = 5000;

// Articles from the last list load, so opening one needs no second request.
// In memory only — gone when the app restarts.
const recent = new Map<string, Article>();

type Reply<T> = { data: T | null; error: unknown };

async function query<T>(run: () => PromiseLike<Reply<T>>): Promise<ArticlesResult<T>> {
  try {
    const reply = await Promise.race([
      run(),
      new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), TIMEOUT_MS)),
    ]);
    if (reply === 'timeout') return { error: 'offline' };
    if (reply.error || reply.data === null) {
      return { error: isNetworkError(reply.error) ? 'offline' : 'unavailable' };
    }
    return { data: reply.data };
  } catch (e) {
    return { error: isNetworkError(e) ? 'offline' : 'unavailable' };
  }
}

export const articlesService = {
  /** Articles for the selected diabetes type (type-specific + 'both'), newest first. */
  async forType(type: DiabetesType): Promise<ArticlesResult<Article[]>> {
    const sb = getSupabase();
    if (!sb) return { error: 'not-configured' };
    const result = await query<Article[]>(() =>
      sb
        .from('articles')
        .select('*')
        .is('deleted_at', null)
        .in('diabetes_type', [type, 'both'])
        .order('published_at', { ascending: false })
    );
    if ('data' in result) for (const a of result.data) recent.set(a.id, a);
    return result;
  },

  /** One article — from the last list load if possible, else from the server. */
  async byId(id: string): Promise<ArticlesResult<Article>> {
    const cached = recent.get(id);
    if (cached) return { data: cached };
    const sb = getSupabase();
    if (!sb) return { error: 'not-configured' };
    return query<Article>(() =>
      sb.from('articles').select('*').eq('id', id).is('deleted_at', null).single()
    );
  },
};

/** User-facing explanation for a failed load. */
export function articlesErrorText(error: ArticlesError): string {
  switch (error) {
    case 'offline':
      return 'Der Ratgeber ist nur mit Internetverbindung verfügbar.';
    case 'not-configured':
      return 'Der Ratgeber braucht eine Verbindung zum Dialy-Server, der hier nicht eingerichtet ist.';
    default:
      return 'Die Artikel konnten gerade nicht geladen werden.';
  }
}
