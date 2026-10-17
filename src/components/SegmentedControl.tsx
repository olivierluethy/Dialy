import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { radius, spacing, type Colors, type ThemeMode } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { Icon } from '@/components/Icon';
import { useAppStore } from '@/state/store';
import { syncEngine } from '@/sync/syncEngine';
import { LANGUAGES, useLanguage, useT } from '@/i18n';
import { unitOptions } from '@/utils/glucose';
import type { DiabetesType } from '@/types/models';

/**
 * Typ-1 / Typ-2 segmented control. Selected segment is filled accent-green;
 * unselected is a surface with muted text.
 */
export function TypeSegmentedControl({
  value,
  onChange,
}: {
  value: DiabetesType;
  onChange: (type: DiabetesType) => void;
}) {
  const t = useT();
  const options: Array<{ value: DiabetesType; label: string }> = [
    { value: 't1', label: t.diabetesType.t1 },
    { value: 't2', label: t.diabetesType.t2 },
  ];
  return <Segmented options={options} value={value} onChange={onChange} />;
}

/**
 * The user's diabetes type (settings and Ratgeber share it). Persisted in the
 * store and, when signed in, saved to the account on the next sync.
 */
export function DiabetesTypeControl() {
  const type = useAppStore((s) => s.diabetesType);
  const setType = useAppStore((s) => s.setDiabetesType);
  const onChange = (value: DiabetesType) => {
    if (value === type) return;
    setType(value);
    if (useAppStore.getState().user) syncEngine.scheduleSync();
  };
  return <TypeSegmentedControl value={type} onChange={onChange} />;
}

/** Appearance picker: Dunkel / Hell / System. Persisted in the store. */
export function ThemeModeControl() {
  const mode = useAppStore((s) => s.themeMode);
  const setMode = useAppStore((s) => s.setThemeMode);
  const t = useT();
  const options: Array<{ value: ThemeMode; label: string }> = [
    { value: 'dark', label: t.theme.dark },
    { value: 'light', label: t.theme.light },
    { value: 'system', label: t.theme.system },
  ];
  return <Segmented options={options} value={mode} onChange={setMode} />;
}

/**
 * Language select list. Until the user picks one, the device
 * language is used (and shown as selected). Persisted in the store.
 */
export function LanguageControl() {
  const language = useLanguage();
  const setLanguage = useAppStore((s) => s.setLanguage);
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const selected = LANGUAGES.find((option) => option.code === language)!;

  return (
    <View style={styles.selectContainer}>
      <Pressable
        onPress={() => setOpen((current) => !current)}
        accessibilityRole="button"
        accessibilityLabel={`${t.common.language}: ${selected.name}`}
        accessibilityState={{ expanded: open }}
        style={({ pressed }) => [styles.select, pressed && styles.optionPressed]}
      >
        <Text style={styles.selectText}>{selected.name}</Text>
        <Icon name="chevronDown" size={18} color={colors.textSecondary} style={open ? styles.chevronOpen : undefined} />
      </Pressable>
      {open && (
        <View style={styles.options}>
          {LANGUAGES.map((option) => (
            <Pressable
              key={option.code}
              onPress={() => {
                setOpen(false);
                setLanguage(option.code);
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: option.code === language }}
              style={({ pressed }) => [
                styles.option,
                option.code === language && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}
            >
              <Text style={styles.selectText}>{option.name}</Text>
              {option.code === language && <Icon name="check" size={18} color={colors.textPrimary} />}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

/** Blood-glucose unit picker: mmol/L / mg/dL (issue #21). Persisted in the store. */
export function GlucoseUnitControl() {
  const unit = useAppStore((s) => s.glucoseUnit);
  const setUnit = useAppStore((s) => s.setGlucoseUnit);
  return <Segmented options={unitOptions()} value={unit} onChange={setUnit} />;
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
    selectContainer: { marginBottom: spacing.lg },
    select: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      minHeight: 48, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
      borderRadius: radius.input, borderWidth: 1, borderColor: colors.border,
      backgroundColor: colors.bgInput,
    },
    selectText: { flex: 1, fontSize: 15, color: colors.textPrimary },
    chevronOpen: { transform: [{ rotate: '180deg' }] },
    options: {
      marginTop: spacing.xs, borderRadius: radius.input,
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgSurface,
      overflow: 'hidden',
    },
    option: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      minHeight: 48, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    },
    optionSelected: { backgroundColor: colors.bgInput },
    optionPressed: { backgroundColor: colors.bgSurfaceAlt },
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
    labelActive: { color: colors.textOnAccent },
  });
