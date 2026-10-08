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
}

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
}

export type Activity = 'wandern' | 'laufen' | 'rad' | 'schwimmen' | 'kraft';

export interface BgCurvePoint {
  minute: number;
  value: number; // mmol/l (illustrative estimate)
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
}

export interface BgReading extends SyncMeta {
  value_mmol: number;
  source: 'manual' | 'cgm';
  logged_at: string;
}

export interface Profile extends SyncMeta {
  diabetes_type: DiabetesType;
  is_premium: boolean;
  settings: Record<string, unknown>;
}
