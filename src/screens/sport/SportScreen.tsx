import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { ScreenTitle, SectionLabel, Card } from '@/components/primitives';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { SelectableChip } from '@/components/Chip';
import { BgChart } from '@/components/BgChart';
import { GateNotice } from '@/components/GateNotice';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { sportsRepo } from '@/db/repositories/sports';
import { can, gateCopy } from '@/policy/gating';
import { estimateBgCurve } from '@/utils/sportCurve';
import type { Activity } from '@/types/models';

const ACTIVITIES: Array<{ value: Activity; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { value: 'wandern', label: 'Wandern', icon: 'trail-sign' },
  { value: 'laufen', label: 'Laufen', icon: 'walk' },
  { value: 'rad', label: 'Rad', icon: 'bicycle' },
  { value: 'schwimmen', label: 'Schwimmen', icon: 'water' },
  { value: 'kraft', label: 'Kraft', icon: 'barbell' },
];

// Small numeric helper that tolerates empty / partial input.
const num = (s: string, fallback = 0): number => {
  const n = parseFloat(s.replace(',', '.'));
  return Number.isNaN(n) ? fallback : n;
};

export function SportScreen() {
  const styles = useThemedStyles(makeStyles);
  const navigation = useNavigation<any>();
  const user = useAppStore((s) => s.user);
  const isPremium = useAppStore((s) => s.isPremium);
  const ctx = { isLoggedIn: user !== null, isPremium };

  const [activity, setActivity] = useState<Activity>('laufen');
  const [duration, setDuration] = useState('45');
  const [bgBefore, setBgBefore] = useState('7.4');

  const [carbsBeforeHours, setCarbsBeforeHours] = useState('0.5');
  const [carbsBeforeG, setCarbsBeforeG] = useState('20');
  const [carbsAfterHours, setCarbsAfterHours] = useState('1.5');
  const [carbsAfterG, setCarbsAfterG] = useState('15');

  // Manual pump note ONLY — a value the user records about their own pump
  // setting. Never a computed recommendation.
  const [pumpPct, setPumpPct] = useState('30');
  const [pumpMin, setPumpMin] = useState('60');

  const [saved, setSaved] = useState(false);

  const curve = useMemo(
    () =>
      estimateBgCurve({
        activity,
        durationMin: num(duration, 0),
        bgBeforeMmol: num(bgBefore, 7),
      }),
    [activity, duration, bgBefore]
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

  const goRegister = () => navigation.navigate('Login', { screen: 'Register' });

  return (
    <Screen>
      <ScreenTitle>Sport planen</ScreenTitle>

      {/* Activity */}
      <SectionLabel>Sportart</SectionLabel>
      <View style={styles.activityRow}>
        {ACTIVITIES.map((a) => (
          <SelectableChip
            key={a.value}
            label={a.label}
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
          label="Dauer (Minuten)"
          value={duration}
          onChangeText={(t) => {
            setDuration(t.replace(/[^0-9]/g, ''));
            setSaved(false);
          }}
          keyboardType="number-pad"
          containerStyle={styles.col}
        />
        <TextField
          label="Blutzucker vor Sport"
          value={bgBefore}
          onChangeText={(t) => {
            setBgBefore(t);
            setSaved(false);
          }}
          keyboardType="decimal-pad"
          focusedHighlight
          containerStyle={styles.col}
          placeholder="mmol/l"
        />
      </View>

      {/* Estimated curve */}
      <SectionLabel>Geschätzter BZ-Verlauf</SectionLabel>
      <Card>
        <BgChart curve={curve} />
        <Text style={styles.disclaimer}>
          ⚠️ Schätzung, keine medizinische Empfehlung. Dialy berechnet keine
          Insulindosen.
        </Text>
      </Card>

      {/* Carbs before / after */}
      <SectionLabel style={styles.spacedLabel}>Kohlenhydrate vor Sport</SectionLabel>
      <Card>
        <Text style={styles.sentence}>
          Vor Sport{' '}
          <InlineInput value={carbsBeforeHours} onChange={setCarbsBeforeHours} width={48} /> Std.
          → <InlineInput value={carbsBeforeG} onChange={setCarbsBeforeG} width={56} /> g KH
        </Text>
      </Card>

      <SectionLabel style={styles.spacedLabel}>Kohlenhydrate nach Sport</SectionLabel>
      <Card>
        <Text style={styles.sentence}>
          Nach{' '}
          <InlineInput value={carbsAfterHours} onChange={setCarbsAfterHours} width={48} /> Std.
          → <InlineInput value={carbsAfterG} onChange={setCarbsAfterG} width={56} /> g KH
        </Text>
        <Text style={styles.hint}>
          Nach dem Sport bleibt die Insulinempfindlichkeit erhöht, während die
          Glykogenspeicher wieder aufgefüllt werden.
        </Text>
      </Card>

      {/* Pump reduction — manual note only */}
      <SectionLabel style={styles.spacedLabel}>Insulinrate reduzieren (Pumpe)</SectionLabel>
      <Card>
        <Text style={styles.sentence}>
          Reduktion <InlineInput value={pumpPct} onChange={setPumpPct} width={56} /> % für{' '}
          <InlineInput value={pumpMin} onChange={setPumpMin} width={56} /> min
        </Text>
        <Text style={styles.hint}>
          Nur eine Notiz zu deiner eigenen Pumpeneinstellung. Dialy gibt keine
          Empfehlung ab und berechnet nichts.
        </Text>
      </Card>

      {/* Save / gating */}
      {can('saveDiaryEntry', ctx) ? (
        <Button
          title={saved ? 'Im Tagebuch gespeichert ✓' : 'Sport speichern'}
          icon={saved ? 'checkmark' : 'save'}
          onPress={save}
          disabled={saved}
          style={styles.saveBtn}
        />
      ) : (
        <View style={styles.saveBtn}>
          <GateNotice message={gateCopy.saveSport} onRegister={goRegister} />
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
