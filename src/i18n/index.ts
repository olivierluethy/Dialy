import { useAppStore } from '@/state/store';
import de, { type Dict } from '@/i18n/locales/de';
import deDE from '@/i18n/locales/de-DE';
import en from '@/i18n/locales/en';
import fr from '@/i18n/locales/fr';
import it from '@/i18n/locales/it';
import es from '@/i18n/locales/es';
import pt from '@/i18n/locales/pt';

/**
 * UI languages. German is the reference (and the language of the stored
 * data: food names, categories, portion labels); the others translate it.
 * German comes in two variants: 'de' is Swiss Standard German (Rahm, Poulet,
 * "ss"), 'de-DE' German Standard German (Sahne, Hähnchen, "ß"). Food names
 * in German Standard German are stored with the food (names['de-DE']).
 *
 * Components get the dictionary with `useT()` (re-renders on a language
 * change); plain functions outside React use `getT()`.
 */
export type Language = 'de' | 'de-DE' | 'en' | 'fr' | 'it' | 'es' | 'pt';
/** The user's choice: a language, or follow the device. */
export type LanguageSetting = Language | 'system';

export type { Dict };

const DICTS: Record<Language, Dict> = { de, 'de-DE': deDE, en, fr, it, es, pt };

/** Both German variants. */
export const isGerman = (lang: Language): boolean => lang === 'de' || lang === 'de-DE';

/**
 * Picker order: the Swiss national languages first, German (Germany) next to
 * Swiss German, then English, Spanish and Portuguese. Names in their own
 * language. Portuguese is European Portuguese.
 */
export const LANGUAGES: Array<{ code: Language; name: string; short: string }> = [
  { code: 'de', name: 'Deutsch (Schweiz)', short: 'DE-CH' },
  { code: 'de-DE', name: 'Deutsch (Deutschland)', short: 'DE-DE' },
  { code: 'fr', name: 'Français', short: 'FR' },
  { code: 'it', name: 'Italiano', short: 'IT' },
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'es', name: 'Español', short: 'ES' },
  { code: 'pt', name: 'Português', short: 'PT' },
];

/**
 * Device language if supported, else Swiss German. German outside
 * Switzerland and Liechtenstein (Germany, Austria, …) uses the German
 * variant.
 */
export function systemLanguage(): Language {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const [base, region] = locale.toLowerCase().split(/[-_]/);
    if (base === 'de') return !region || region === 'ch' || region === 'li' ? 'de' : 'de-DE';
    if (base && base in DICTS) return base as Language;
  } catch {
    // No Intl support: fall through.
  }
  return 'de';
}

export const resolveLanguage = (setting: LanguageSetting): Language =>
  setting === 'system' ? systemLanguage() : setting;

/** Current language, for code outside React. */
export const getLanguage = (): Language => resolveLanguage(useAppStore.getState().language);

/** Current dictionary, for code outside React. */
export const getT = (): Dict => DICTS[getLanguage()];

/** Current language; re-renders when it changes. */
export function useLanguage(): Language {
  return resolveLanguage(useAppStore((s) => s.language));
}

/** Current dictionary; re-renders when the language changes. */
export function useT(): Dict {
  return DICTS[useLanguage()];
}
