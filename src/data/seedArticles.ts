import type { Article } from '@/types/models';

/**
 * Seed articles for the Ratgeber. Content is data-driven so it can later be
 * updated from the central DB (Supabase `articles`) without an app update.
 *
 * Each article is tagged for an audience: 't1', 't2' or 'both'. The Ratgeber
 * filters by the globally selected diabetes type.
 *
 * Body text is placeholder German prose — purely informational, never
 * therapeutic instruction.
 */
export type ArticleSeed = Pick<
  Article,
  | 'id'
  | 'category'
  | 'title'
  | 'body'
  | 'read_minutes'
  | 'published_at'
  | 'diabetes_type'
>;

const LOREM = (topic: string): string =>
  [
    `${topic}`,
    '',
    'Dieser Beitrag fasst allgemeine, informative Hintergründe zusammen. Er ' +
      'ersetzt keine ärztliche Beratung und gibt keine Therapie-Empfehlungen. ' +
      'Bespriche Anpassungen immer mit deinem Behandlungsteam.',
    '',
    'Im Alltag hilft es, Zusammenhänge zu verstehen und eigene Beobachtungen ' +
      'festzuhalten. Notiere, was du isst, wie du dich bewegst und wie sich ' +
      'deine Werte entwickeln. Mit der Zeit erkennst du Muster, die zu dir passen.',
    '',
    'Wichtig: Jeder Körper reagiert unterschiedlich. Nutze die Informationen ' +
      'als Orientierung und passe sie gemeinsam mit Fachpersonen an deine ' +
      'persönliche Situation an.',
  ].join('\n');

export const SEED_ARTICLES: ArticleSeed[] = [
  // --- Typ 1 ---
  {
    id: 'art-t1-basalrate',
    category: 'Sport',
    title: 'Basalrate beim Ausdauersport richtig anpassen',
    body: LOREM('Basalrate beim Ausdauersport richtig anpassen'),
    read_minutes: 12,
    published_at: '2026-05-16',
    diabetes_type: 't1',
  },
  {
    id: 'art-t1-dawn',
    category: 'Nacht',
    title: 'Dawn-Phänomen: Ursachen & Gegenmassnahmen',
    body: LOREM('Dawn-Phänomen: Ursachen & Gegenmassnahmen'),
    read_minutes: 8,
    published_at: '2026-05-12',
    diabetes_type: 't1',
  },
  {
    id: 'art-t1-insulinarten',
    category: 'Insulin',
    title: 'Insulinarten und ihre Wirkprofile im Vergleich',
    body: LOREM('Insulinarten und ihre Wirkprofile im Vergleich'),
    read_minutes: 11,
    published_at: '2026-05-09',
    diabetes_type: 't1',
  },
  {
    id: 'art-t1-closedloop',
    category: 'Technologie',
    title: 'Closed-Loop-Systeme im Alltag',
    body: LOREM('Closed-Loop-Systeme im Alltag'),
    read_minutes: 14,
    published_at: '2026-05-05',
    diabetes_type: 't1',
  },
  {
    id: 'art-t1-gi',
    category: 'Ernährung',
    title: 'Glykämischer Index für Typ-1-Diabetiker',
    body: LOREM('Glykämischer Index für Typ-1-Diabetiker'),
    read_minutes: 9,
    published_at: '2026-05-01',
    diabetes_type: 't1',
  },

  // --- Typ 2 ---
  {
    id: 'art-t2-bewegung',
    category: 'Sport',
    title: 'Regelmässige Bewegung als Baustein bei Typ 2',
    body: LOREM('Regelmässige Bewegung als Baustein bei Typ 2'),
    read_minutes: 10,
    published_at: '2026-05-15',
    diabetes_type: 't2',
  },
  {
    id: 'art-t2-ernaehrung',
    category: 'Ernährung',
    title: 'Ballaststoffe und langsame Kohlenhydrate verstehen',
    body: LOREM('Ballaststoffe und langsame Kohlenhydrate verstehen'),
    read_minutes: 9,
    published_at: '2026-05-11',
    diabetes_type: 't2',
  },
  {
    id: 'art-t2-medikamente',
    category: 'Medikamente',
    title: 'Orale Medikamente bei Typ 2: ein Überblick',
    body: LOREM('Orale Medikamente bei Typ 2: ein Überblick'),
    read_minutes: 12,
    published_at: '2026-05-07',
    diabetes_type: 't2',
  },
  {
    id: 'art-t2-gewicht',
    category: 'Alltag',
    title: 'Gewicht, Schlaf und Stress im Zusammenspiel',
    body: LOREM('Gewicht, Schlaf und Stress im Zusammenspiel'),
    read_minutes: 8,
    published_at: '2026-05-03',
    diabetes_type: 't2',
  },

  // --- Both ---
  {
    id: 'art-both-hypo',
    category: 'Sicherheit',
    title: 'Unterzuckerung erkennen und richtig reagieren',
    body: LOREM('Unterzuckerung erkennen und richtig reagieren'),
    read_minutes: 7,
    published_at: '2026-05-18',
    diabetes_type: 'both',
  },
  {
    id: 'art-both-reisen',
    category: 'Alltag',
    title: 'Mit Diabetes auf Reisen: gut vorbereitet unterwegs',
    body: LOREM('Mit Diabetes auf Reisen: gut vorbereitet unterwegs'),
    read_minutes: 10,
    published_at: '2026-04-29',
    diabetes_type: 'both',
  },
];
