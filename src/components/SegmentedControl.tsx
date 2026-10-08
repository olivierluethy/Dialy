import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { radius, spacing, type Colors, type ThemeMode } from '@/theme/theme';
import { useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import type { DiabetesType } from '@/types/models';

const TYPE_OPTIONS: Array<{ value: DiabetesType; label: string }> = [
  { value: 't1', label: 'Typ 1' },
  { value: 't2', label: 'Typ 2' },
];

const THEME_OPTIONS: Array<{ value: ThemeMode; label: string }> = [
  { value: 'dark', label: 'Dunkel' },
  { value: 'light', label: 'Hell' },
  { value: 'system', label: 'System' },
];

/**
 * Typ-1 / Typ-2 segmented control shown at the top of the Ratgeber (it
 * filters the articles; no other screen uses the type). Selection lives in
 * the Zustand store and persists across restarts. Selected segment is filled accent-green; unselected is a surface
 * with muted text.
 */
export function TypeSegmentedControl() {
  const type = useAppStore((s) => s.diabetesType);
  const setType = useAppStore((s) => s.setDiabetesType);
  return <Segmented options={TYPE_OPTIONS} value={type} onChange={setType} />;
}

/** Appearance picker: Dunkel / Hell / System. Persisted in the store. */
export function ThemeModeControl() {
  const mode = useAppStore((s) => s.themeMode);
  const setMode = useAppStore((s) => s.setThemeMode);
  return <Segmented options={THEME_OPTIONS} value={mode} onChange={setMode} />;
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.segment, active && styles.segmentActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.bgSurface,
      borderRadius: radius.pill,
      padding: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
    },
    segment: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: radius.pill,
    },
    segmentActive: { backgroundColor: colors.accent },
    label: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
    labelActive: { color: '#FFFFFF' },
  });
