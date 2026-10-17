/** Shared domain model types for Dialy. */

export type DiabetesType = 't1' | 't2';
export type ArticleAudience = 't1' | 't2' | 'both';

/** Columns present on every syncable row. */
export interface SyncMeta {
  id: string; // UUID, generated client-side
  user_id: string | null;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601 — drives last-write-wins
  deleted_at: string | null; // soft delete only
}

export interface Portion {
  label: string;
  grams: number;
}

export interface Article extends SyncMeta {
  category: string;
  title: string;
  body: string;
  read_minutes: number;
  published_at: string;
  diabetes_type: ArticleAudience;
}

export interface Food extends SyncMeta {
  name: string;
  food_group: string; // sub-category, shown under the name
  categories: string[]; // top-level categories, for filtering
  carbs_per_100g: number;
  sugar_per_100g: number;
  fat_per_100g: number;
  glycemic_index: number | null; // unknown for BLV foods
  portions: Portion[]; // may be empty (BLV foods)
  names: FoodNames; // name in the other UI languages; German is `name`
}

/** Translated food names, e.g. { en: 'Apple', fr: 'Pomme' }; any may be missing. */
export type FoodNames = Partial<Record<'en' | 'fr' | 'it', string>>;

export interface MealEntry extends SyncMeta {
  food_id: string | null;
  name: string;
  grams: number;
  carbs_g: number;
  sugar_g: number;
  fat_g: number;
  glycemic_index: number | null;
  be: number;
  photo_uri: string | null;
  logged_at: string;
  note: string | null; // user's comment (Tagebuch)
}

export type Activity = 'wandern' | 'laufen' | 'rad' | 'schwimmen' | 'kraft';

export interface BgCurvePoint {
  minute: number;
  value: number; // unitless generic tendency (utils/sportCurve), never mmol/l
}

export interface SportEntry extends SyncMeta {
  activity: Activity;
  duration_min: number;
  bg_before_mmol: number;
  carbs_before_g: number;
  carbs_before_hours: number;
  carbs_after_g: number;
  carbs_after_hours: number;
  pump_reduction_pct: number | null; // manual note about the user's own pump setting
  pump_reduction_min: number | null;
  bg_curve: BgCurvePoint[];
  logged_at: string;
  note: string | null; // user's comment (Tagebuch)
}

export interface BgReading extends SyncMeta {
  value_mmol: number;
  source: 'manual' | 'cgm';
  logged_at: string;
}

/** Where a glucose reading came from (issue #21 §1). */
export type GlucoseSource = 'dexcom' | 'libre' | 'manual' | 'health_platform';
export type GlucoseTrend =
  | 'rising_fast'
  | 'rising'
  | 'steady'
  | 'falling'
  | 'falling_fast';

/**
 * A single continuous-glucose reading. Stored in mg/dL (the providers' raw
 * unit); the UI converts to mmol/L for display (utils/glucose). One row per
 * measurement; (user_id, source, source_record_id) is unique so re-imports
 * don't duplicate (issue #21 §1).
 */
export interface GlucoseReading extends SyncMeta {
  source: GlucoseSource;
  /** Provider's own id for this reading, for deduplication. */
  source_record_id: string;
  /** Measurement time, ISO 8601 UTC — the source of truth for ordering. */
  timestamp_utc: string;
  /** Local time as reported by the device, ISO 8601 (may carry an offset). */
  display_time_local: string;
  value_mgdl: number;
  trend: GlucoseTrend | null;
  /** Provider sensor status (e.g. during warm-up); such values are flagged. */
  status: string | null;
  /** When this reading was written into the app. */
  imported_at: string;
}

export interface Profile extends SyncMeta {
  diabetes_type: DiabetesType;
  is_premium: boolean;
  settings: Record<string, unknown>;
}
