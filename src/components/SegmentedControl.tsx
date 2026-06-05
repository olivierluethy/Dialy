import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme/theme';
import { useAppStore } from '@/state/store';
import type { DiabetesType } from '@/types/models';

const OPTIONS: Array<{ value: DiabetesType; label: string }> = [
  { value: 't1', label: 'Typ 1' },
  { value: 't2', label: 'Typ 2' },
];

/**
 * Global Typ-1 / Typ-2 segmented control shown at the top of every main
 * screen. Selection lives in the Zustand store and persists across tabs and
 * restarts. Selected segment is filled accent-green; unselected is a dark
 * surface with muted text.
 */
export function TypeSegmentedControl() {
  const type = useAppStore((s) => s.diabetesType);
  const setType = useAppStore((s) => s.setDiabetesType);

  return (
    <View style={styles.container}>
      {OPTIONS.map((opt) => {
        const active = opt.value === type;
        return (
          <Pressable
            key={opt.value}
            onPress={() => setType(opt.value)}
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

const styles = StyleSheet.create({
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
