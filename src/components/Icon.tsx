import React from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';

/**
 * Central icon set (Apple-style: minimal, consistent line icons).
 *
 * The whole app refers to icons by a SEMANTIC name (`edit`, `delete`,
 * `calendar`, …) through the `<Icon>` component — never by a raw glyph. The
 * one registry below maps each name to an Ionicons glyph, preferring the
 * outline variants for a light, even stroke. Changing the look everywhere, or
 * swapping the underlying icon font later, happens here alone.
 */
export type IconName =
  // Navigation & chrome
  | 'chevronLeft'
  | 'chevronRight'
  | 'chevronDown'
  | 'arrowRight'
  | 'close'
  | 'menu'
  // Actions
  | 'search'
  | 'edit'
  | 'delete'
  | 'add'
  | 'check'
  | 'checkDone'
  | 'save'
  | 'send'
  | 'refresh'
  | 'upload'
  | 'clear'
  // Selection & form state
  | 'radioOn'
  | 'radioOff'
  | 'checkboxOn'
  | 'checkboxOff'
  | 'select'
  // Status
  | 'lock'
  | 'premium'
  | 'time'
  | 'alert'
  | 'device'
  | 'offline'
  | 'syncing'
  | 'synced'
  // Account
  | 'person'
  | 'personCircle'
  | 'personAdd'
  | 'personRemove'
  | 'login'
  | 'logout'
  | 'settings'
  | 'info'
  | 'key'
  | 'mail'
  | 'google'
  // Appearance
  | 'moon'
  | 'sun'
  // Content & sections
  | 'brand'
  | 'book'
  | 'glucose'
  | 'flask'
  | 'heart'
  | 'list'
  | 'calendar'
  | 'meal'
  // Activities
  | 'activityHike'
  | 'activityRun'
  | 'activityBike'
  | 'activitySwim'
  | 'activityStrength'
  // Ratgeber categories
  | 'catNight'
  | 'catInsulin'
  | 'catTech'
  | 'catNutrition'
  | 'catMeds'
  | 'catEveryday'
  | 'catSafety';

type Glyph = keyof typeof Ionicons.glyphMap;

/** Semantic name → Ionicons glyph. Outline variants keep the set elegant. */
export const ICONS: Record<IconName, Glyph> = {
  chevronLeft: 'chevron-back',
  chevronRight: 'chevron-forward',
  chevronDown: 'chevron-down',
  arrowRight: 'arrow-forward-outline',
  close: 'close-outline',
  menu: 'menu-outline',

  search: 'search-outline',
  edit: 'pencil',
  delete: 'trash-outline',
  add: 'add',
  check: 'checkmark',
  checkDone: 'checkmark-done',
  save: 'save-outline',
  send: 'paper-plane-outline',
  refresh: 'refresh-outline',
  upload: 'cloud-upload-outline',
  clear: 'close-circle', // filled: the familiar "clear field" affordance

  radioOn: 'checkmark-circle-outline',
  radioOff: 'ellipse-outline',
  checkboxOn: 'checkbox-outline',
  checkboxOff: 'square-outline',
  select: 'checkmark-circle-outline',

  lock: 'lock-closed-outline',
  premium: 'star-outline',
  time: 'time-outline',
  alert: 'alert-circle-outline',
  device: 'phone-portrait-outline',
  offline: 'cloud-offline-outline',
  syncing: 'sync-outline',
  synced: 'cloud-done-outline',

  person: 'person-outline',
  personCircle: 'person-circle-outline',
  personAdd: 'person-add-outline',
  personRemove: 'person-remove-outline',
  login: 'log-in-outline',
  logout: 'log-out-outline',
  settings: 'settings-outline',
  info: 'information-circle-outline',
  key: 'key-outline',
  mail: 'mail-outline',
  google: 'logo-google',

  moon: 'moon-outline',
  sun: 'sunny-outline',

  brand: 'water', // the Dialy drop mark (filled, accent)
  book: 'book-outline',
  glucose: 'pulse-outline',
  flask: 'flask-outline',
  heart: 'heart-outline',
  list: 'list-outline',
  calendar: 'calendar-outline',
  meal: 'restaurant-outline',

  activityHike: 'trail-sign-outline',
  activityRun: 'walk',
  activityBike: 'bicycle',
  activitySwim: 'water-outline',
  activityStrength: 'barbell-outline',

  catNight: 'moon-outline',
  catInsulin: 'water-outline',
  catTech: 'hardware-chip-outline',
  catNutrition: 'restaurant-outline',
  catMeds: 'medical-outline',
  catEveryday: 'sunny-outline',
  catSafety: 'shield-checkmark-outline',
};

export interface IconProps {
  name: IconName;
  size?: number;
  /** Defaults to the primary text colour. */
  color?: string;
  style?: StyleProp<TextStyle>;
  /** Provide only for a standalone, meaningful icon; decorative icons stay hidden. */
  accessibilityLabel?: string;
}

/** The app's icon. Always use this instead of a raw icon font. */
export function Icon({ name, size = 22, color, style, accessibilityLabel }: IconProps) {
  const { colors } = useTheme();
  return (
    <Ionicons
      name={ICONS[name]}
      size={size}
      color={color ?? colors.textPrimary}
      style={style}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityElementsHidden={!accessibilityLabel}
      importantForAccessibility={accessibilityLabel ? 'yes' : 'no'}
      allowFontScaling={false}
    />
  );
}
