import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/theme';

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

/** Pill-shaped selectable chip (portion presets, activities). */
export function SelectableChip({ label, selected, onPress, icon }: SelectableChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected ? styles.selected : styles.unselected]}
    >
      <View style={styles.row}>
        {icon && (
          <Ionicons
            name={icon}
            size={16}
            color={selected ? colors.textOnAccent : colors.textSecondary}
            style={styles.icon}
          />
        )}
        <Text style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: spacing.xs },
  selected: { backgroundColor: colors.accent, borderColor: colors.accent },
  unselected: { backgroundColor: colors.bgSurfaceAlt, borderColor: colors.border },
  label: { fontSize: 14, fontWeight: '600' },
  labelSelected: { color: colors.textOnAccent },
  labelUnselected: { color: colors.textSecondary },
});
