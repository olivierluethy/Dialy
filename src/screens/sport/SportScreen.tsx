import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { ScreenTitle, SectionLabel, Card } from '@/components/primitives';
import { Icon, type IconName } from '@/components/Icon';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { SelectableChip } from '@/components/Chip';
import { TrendChart } from '@/components/TrendChart';
import { GateNotice } from '@/components/GateNotice';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { sportsRepo } from '@/db/repositories/sports';
import { can } from '@/policy/gating';
import { useT } from '@/i18n';
import { illustrativeTrend } from '@/utils/sportCurve';
import type { Activity } from '@/types/models';

// Labels: t.activities.
const ACTIVITIES: Array<{ value: Activity; icon: IconName }> = [
  { value: 'wandern', icon: 'activityHike' },
  { value: 'laufen', icon: 'activityRun' },
  { value: 'rad', icon: 'activityBike' },
  { value: 'schwimmen', icon: 'activitySwim' },
  { value: 'kraft', icon: 'activityStrength' },
];

// Small numeric helper that tolerates empty / partial input.
const num = (s: string, fallback = 0): number => {
  const n = parseFloat(s.replace(',', '.'));
  return Number.isNaN(n) ? fallback : n;
};

export function SportScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const user = useAppStore((s) => s.user);
  const isPremium = useAppStore((s) => s.isPremium);
  const ctx = { isLoggedIn: user !== null, isPremium };

  const [activity, setActivity] = useState<Activity>('laufen');
  const [duration, setDuration] = useState('45');
  // The user's own measurement, logged as-is (no default value).
  const [bgBefore, setBgBefore] = useState('');

  // Carbs and pump fields are a log of what the user actually did. They start
  // empty on purpose: pre-filled numbers would read like a recommendation
  // (and could make Dialy a medical device).
  const [carbsBeforeHours, setCarbsBeforeHours] = useState('');
  const [carbsBeforeG, setCarbsBeforeG] = useState('');
  const [carbsAfterHours, setCarbsAfterHours] = useState('');
  const [carbsAfterG, setCarbsAfterG] = useState('');

  // Manual pump note ONLY — a value the user records about their own pump
  // setting. Never a computed or suggested value.
  const [pumpPct, setPumpPct] = useState('');
  const [pumpMin, setPumpMin] = useState('');

  const [saved, setSaved] = useState(false);

  // Generic illustration only — must never depend on the user's glucose value.
  const curve = useMemo(
    () => illustrativeTrend({ activity, durationMin: num(duration, 0) }),
    [activity, duration]
  );

  const save = async () => {
    if (!can('saveDiaryEntry', ctx)) return;
    await sportsRepo.create(
      {
        activity,
        duration_min: Math.round(num(duration)),
        bg_before_mmol: num(bgBefore),
        carbs_before_g: num(carbsBeforeG),
        carbs_before_hours: num(carbsBeforeHours),
        carbs_after_g: num(carbsAfterG),
        carbs_after_hours: num(carbsAfterHours),
        pump_reduction_pct: pumpPct.length ? num(pumpPct) : null,
        pump_reduction_min: pumpMin.length ? num(pumpMin) : null,
        bg_curve: curve,
      },
      user?.id ?? null
    );
    setSaved(true);
  };

  return (
    <Screen>
      <ScreenTitle>{t.sport.title}</ScreenTitle>

      {/* Activity */}
      <SectionLabel>{t.sport.activity}</SectionLabel>
      <View style={styles.activityRow}>
        {ACTIVITIES.map((a) => (
          <SelectableChip
            key={a.value}
            label={t.activities[a.value]}
            icon={a.icon}
            selected={activity === a.value}
            onPress={() => {
              setActivity(a.value);
              setSaved(false);
            }}
          />
        ))}
      </View>

      <View style={styles.twoCol}>
        <TextField
          label={t.sport.duration}
          value={duration}
          onChangeText={(v) => {
            setDuration(v.replace(/[^0-9]/g, ''));
            setSaved(false);
          }}
          keyboardType="number-pad"
          containerStyle={styles.col}
        />
        <TextField
          label={t.sport.bgBefore}
          value={bgBefore}
          onChangeText={(v) => {
            setBgBefore(v);
            setSaved(false);
          }}
          keyboardType="decimal-pad"
          focusedHighlight
          containerStyle={styles.col}
          placeholder="mmol/l"
        />
      </View>

      {/* Estimated curve */}
      <SectionLabel>{t.sport.curve}</SectionLabel>
      <Card>
        <TrendChart curve={curve} />
        <Text style={styles.disclaimer}>
          <Icon name="alert" size={13} color={colors.warn} /> {t.sport.disclaimer}
        </Text>
      </Card>

      {/* Carbs before / after */}
      <SectionLabel style={styles.spacedLabel}>{t.sport.carbsBefore}</SectionLabel>
      <Card>
        <Text style={styles.sentence}>
          {t.sport.beforePrefix}{' '}
          <InlineInput value={carbsBeforeHours} onChange={setCarbsBeforeHours} width={48} />{' '}
          {t.units.hoursShort} <Icon name="arrowRight" size={16} color={colors.textSecondary} /> <InlineInput value={carbsBeforeG} onChange={setCarbsBeforeG} width={56} />{' '}
          g {t.units.carbs}
        </Text>
      </Card>

      <SectionLabel style={styles.spacedLabel}>{t.sport.carbsAfter}</SectionLabel>
      <Card>
        <Text style={styles.sentence}>
          {t.sport.afterPrefix}{' '}
          <InlineInput value={carbsAfterHours} onChange={setCarbsAfterHours} width={48} />{' '}
          {t.units.hoursShort} <Icon name="arrowRight" size={16} color={colors.textSecondary} /> <InlineInput value={carbsAfterG} onChange={setCarbsAfterG} width={56} />{' '}
          g {t.units.carbs}
        </Text>
        <Text style={styles.hint}>{t.sport.afterHint}</Text>
      </Card>

      {/* Pump reduction — manual note only */}
      <SectionLabel style={styles.spacedLabel}>{t.sport.pump}</SectionLabel>
      <Card>
        <Text style={styles.sentence}>
          {t.sport.reduction} <InlineInput value={pumpPct} onChange={setPumpPct} width={56} /> %{' '}
          {t.sport.for} <InlineInput value={pumpMin} onChange={setPumpMin} width={56} />{' '}
          {t.units.minutes}
        </Text>
        <Text style={styles.hint}>{t.sport.pumpHint}</Text>
      </Card>

      {/* Save / gating */}
      {can('saveDiaryEntry', ctx) ? (
        <Button
          title={saved ? t.sport.saved : t.sport.save}
          icon={saved ? 'check' : 'save'}
          onPress={save}
          disabled={saved || bgBefore.trim() === ''}
          style={styles.saveBtn}
        />
      ) : (
        <View style={styles.saveBtn}>
          <GateNotice message={t.gate.saveSport} returnTo="Sport" />
        </View>
      )}
    </Screen>
  );
}

/** Small inline numeric input embedded in a sentence. */
function InlineInput({
  value,
  onChange,
  width,
}: {
  value: string;
  onChange: (v: string) => void;
  width: number;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <TextField
      value={value}
      onChangeText={onChange}
      keyboardType="decimal-pad"
      containerStyle={styles.inlineContainer}
      style={[styles.inlineInput, { width }]}
    />
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    activityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
    twoCol: { flexDirection: 'row', gap: spacing.md },
    col: { flex: 1 },
    disclaimer: {
      fontSize: 13,
      color: colors.warn,
      marginTop: spacing.md,
      lineHeight: 18,
    },
    spacedLabel: { marginTop: spacing.lg },
    sentence: { fontSize: 16, color: colors.textPrimary, lineHeight: 40 },
    hint: { fontSize: 13, color: colors.textTertiary, marginTop: spacing.sm, lineHeight: 18 },
    inlineContainer: { marginBottom: 0, marginHorizontal: 2 },
    inlineInput: {
      minHeight: 40,
      paddingVertical: 4,
      paddingHorizontal: spacing.sm,
      textAlign: 'center',
      fontWeight: '700',
      color: colors.accent,
    },
    saveBtn: { marginTop: spacing.xl },
  });
