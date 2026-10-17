import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Card, SectionLabel } from '@/components/primitives';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { Dialog } from '@/components/Dialog';
import { GlucoseUnitControl } from '@/components/SegmentedControl';
import { spacing, radius, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { useT } from '@/i18n';
import { dayKey } from '@/utils/format';
import { glucoseRepo } from '@/db/repositories/glucose';
import { mealsRepo } from '@/db/repositories/meals';
import { libreCsvProvider, healthProvider } from '@/services/glucoseProviders';
import { generateDemoDay, csvErrorKey, CsvFormatError } from '@/services/glucoseImport';
import { requestHealthPermission, readHealthGlucose, healthSourceName } from '@/services/healthGlucose';
import { syncEngine } from '@/sync/syncEngine';

const MS_DAY = 24 * 60 * 60 * 1000;
const FIRST_IMPORT_DAYS = 30;

type DialogState =
  | null
  | { kind: 'imported'; inserted: number; duplicates: number }
  | { kind: 'error'; message: string }
  | { kind: 'confirmDelete' }
  | { kind: 'deleted'; count: number };

/**
 * Connect / manage CGM glucose sources (issue #21 §3–§7). MVP: LibreView CSV
 * paste + a demo generator; Dexcom shown as "coming soon". Consent is required
 * before any import; the whole dataset can be deleted here.
 */
export function GlucoseImportScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const user = useAppStore((s) => s.user);
  const consentAt = useAppStore((s) => s.glucoseConsentAt);
  const setConsent = useAppStore((s) => s.setGlucoseConsent);
  const bumpData = useAppStore((s) => s.bumpDataRevision);
  const userId = user?.id ?? null;

  const [csv, setCsv] = useState('');
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [counts, setCounts] = useState<{ libre: number; manual: number; total: number }>({
    libre: 0,
    manual: 0,
    total: 0,
  });

  const refreshCounts = useCallback(() => {
    if (!userId) return;
    glucoseRepo.counts(userId).then((c) =>
      setCounts({ libre: c.libre, manual: c.manual, total: c.libre + c.manual + c.dexcom + c.health_platform })
    );
  }, [userId]);

  useFocusEffect(useCallback(() => void refreshCounts(), [refreshCounts]));

  const consented = consentAt !== null;

  const afterImport = (inserted: number, duplicates: number) => {
    refreshCounts();
    bumpData();
    if (inserted > 0) void syncEngine.syncNow();
    setDialog({ kind: 'imported', inserted, duplicates });
  };

  const importCsv = async () => {
    if (!userId || busy) return;
    setBusy(true);
    try {
      const readings = libreCsvProvider.parse(csv);
      const { inserted, duplicates } = await glucoseRepo.importReadings(readings, userId);
      setCsv('');
      afterImport(inserted, duplicates);
    } catch (e) {
      const key = e instanceof CsvFormatError ? csvErrorKey(e) : 'unknown';
      setDialog({ kind: 'error', message: t.glucose.csvError(key) });
    } finally {
      setBusy(false);
    }
  };

  const importHealth = async () => {
    if (!userId || busy) return;
    setBusy(true);
    try {
      const ok = await requestHealthPermission();
      if (!ok) {
        setDialog({ kind: 'error', message: t.glucose.healthDenied });
        return;
      }
      const last = await glucoseRepo.lastTimestamp(userId, 'health_platform');
      const since = last ?? new Date(Date.now() - FIRST_IMPORT_DAYS * MS_DAY).toISOString();
      const readings = await readHealthGlucose(since);
      const { inserted, duplicates } = await glucoseRepo.importReadings(readings, userId);
      afterImport(inserted, duplicates);
    } finally {
      setBusy(false);
    }
  };

  const importDemo = async () => {
    if (!userId || busy) return;
    setBusy(true);
    try {
      const today = new Date();
      const todayMeals = (await mealsRepo.listAll(userId)).filter(
        (m) => dayKey(m.logged_at) === dayKey(today.toISOString())
      );
      const readings = generateDemoDay(today, todayMeals);
      const { inserted, duplicates } = await glucoseRepo.importReadings(readings, userId);
      afterImport(inserted, duplicates);
    } finally {
      setBusy(false);
    }
  };

  const deleteAll = async () => {
    if (!userId) return;
    const count = await glucoseRepo.deleteAll(userId);
    refreshCounts();
    bumpData();
    void syncEngine.syncNow();
    setDialog({ kind: 'deleted', count });
  };

  if (!userId) {
    return (
      <Screen>
        <Text style={styles.needAccount}>{t.glucose.needAccount}</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.intro}>{t.glucose.intro}</Text>

      {/* Unit */}
      <SectionLabel>{t.glucose.unit}</SectionLabel>
      <GlucoseUnitControl />

      {/* Consent */}
      <SectionLabel style={styles.spaced}>{t.glucose.consentTitle}</SectionLabel>
      <Pressable
        style={[styles.consentRow, consented && styles.consentRowActive]}
        onPress={() => setConsent(!consented)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: consented }}
        accessibilityLabel={t.glucose.consent}
      >
        <Icon
          name={consented ? 'checkboxOn' : 'checkboxOff'}
          size={22}
          color={consented ? colors.accent : colors.textTertiary}
        />
        <Text style={styles.consentText}>{t.glucose.consent}</Text>
      </Pressable>

      {/* Apple Health / Health Connect — reads Dexcom & Libre values via the OS */}
      <SectionLabel style={styles.spaced}>{t.glucose.sources}</SectionLabel>
      <Card>
        <Text style={styles.sourceName}>{healthSourceName()}</Text>
        <Text style={styles.sourceSub}>{t.glucose.healthHelp(healthSourceName())}</Text>
        {healthProvider.isAvailable() ? (
          <Button
            title={t.glucose.healthConnect}
            icon="heart"
            onPress={importHealth}
            loading={busy}
            disabled={!consented}
            style={styles.healthBtn}
          />
        ) : (
          <Text style={styles.unavailable}>{t.glucose.healthUnavailable}</Text>
        )}
      </Card>

      {/* Dexcom direct API (scaffold) */}
      <Card style={styles.spaced}>
        <View style={styles.sourceRow}>
          <View style={styles.flex}>
            <Text style={styles.sourceName}>Dexcom (G6, G7)</Text>
            <Text style={styles.sourceSub}>{t.glucose.dexcomSoon}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t.glucose.comingSoon}</Text>
          </View>
        </View>
      </Card>

      {/* LibreView CSV */}
      <Card style={styles.spaced}>
        <Text style={styles.sourceName}>FreeStyle Libre</Text>
        <Text style={styles.sourceSub}>{t.glucose.libreHelp}</Text>
        <TextField
          value={csv}
          onChangeText={setCsv}
          placeholder={t.glucose.csvPlaceholder}
          multiline
          editable={consented && !busy}
          style={styles.csvInput}
          containerStyle={styles.csvField}
        />
        <Button
          title={t.glucose.importCsv}
          icon="upload"
          onPress={importCsv}
          loading={busy}
          disabled={!consented || csv.trim().length === 0}
        />
      </Card>

      {/* Demo */}
      <Card style={styles.spaced}>
        <Text style={styles.sourceName}>{t.glucose.demoTitle}</Text>
        <Text style={styles.sourceSub}>{t.glucose.demoHelp}</Text>
        <Button
          title={t.glucose.demoCta}
          icon="flask"
          variant="secondary"
          onPress={importDemo}
          loading={busy}
          disabled={!consented}
        />
      </Card>

      {/* Stored data + delete */}
      <SectionLabel style={styles.spaced}>{t.glucose.stored}</SectionLabel>
      <Card>
        <Text style={styles.storedText}>{t.glucose.storedCount(counts.total)}</Text>
        <Pressable style={styles.deleteRow} onPress={() => setDialog({ kind: 'confirmDelete' })} disabled={counts.total === 0}>
          <Icon name="delete" size={18} color={counts.total === 0 ? colors.textTertiary : colors.danger} />
          <Text style={[styles.deleteText, counts.total === 0 && styles.deleteTextDisabled]}>
            {t.glucose.disconnectDelete}
          </Text>
        </Pressable>
      </Card>

      <Text style={styles.disclaimer}>
        <Icon name="alert" size={12} color={colors.warn} /> {t.glucose.disclaimer}
      </Text>

      {/* Dialogs */}
      <Dialog
        visible={dialog?.kind === 'imported'}
        title={t.glucose.importedTitle}
        message={
          dialog?.kind === 'imported' ? t.glucose.importedMessage(dialog.inserted, dialog.duplicates) : undefined
        }
        onClose={() => setDialog(null)}
        actions={[{ label: t.common.ok, variant: 'primary', onPress: () => setDialog(null) }]}
      />
      <Dialog
        visible={dialog?.kind === 'error'}
        title={t.glucose.importFailed}
        message={dialog?.kind === 'error' ? dialog.message : undefined}
        onClose={() => setDialog(null)}
        actions={[{ label: t.common.ok, variant: 'primary', onPress: () => setDialog(null) }]}
      />
      <Dialog
        visible={dialog?.kind === 'confirmDelete'}
        title={t.glucose.deleteTitle}
        message={t.glucose.deleteConfirm}
        onClose={() => setDialog(null)}
        actions={[
          { label: t.common.cancel, onPress: () => setDialog(null) },
          { label: t.common.delete, variant: 'primary', onPress: () => void deleteAll() },
        ]}
      />
      <Dialog
        visible={dialog?.kind === 'deleted'}
        title={t.glucose.deletedTitle}
        message={dialog?.kind === 'deleted' ? t.glucose.deletedMessage(dialog.count) : undefined}
        onClose={() => setDialog(null)}
        actions={[{ label: t.common.ok, variant: 'primary', onPress: () => setDialog(null) }]}
      />
    </Screen>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    intro: { fontSize: 15, color: colors.textSecondary, lineHeight: 21, marginBottom: spacing.lg },
    needAccount: { fontSize: 15, color: colors.textSecondary, lineHeight: 21 },
    spaced: { marginTop: spacing.xl },
    flex: { flex: 1 },
    consentRow: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md,
      backgroundColor: colors.bgSurface, borderRadius: radius.card, borderWidth: 1,
      borderColor: colors.border, padding: spacing.lg,
    },
    consentRowActive: { borderColor: colors.accent },
    consentText: { flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 19 },
    sources: {},
    sourceRow: { flexDirection: 'row', alignItems: 'center' },
    sourceName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
    sourceSub: { fontSize: 13, color: colors.textTertiary, marginTop: 4, lineHeight: 18 },
    badge: { backgroundColor: colors.bgSurfaceAlt, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4 },
    badgeText: { fontSize: 12, color: colors.textTertiary, fontWeight: '600' },
    healthBtn: { marginTop: spacing.md },
    unavailable: { fontSize: 13, color: colors.textTertiary, marginTop: spacing.md, fontStyle: 'italic' },
    csvField: { marginTop: spacing.md, marginBottom: spacing.md },
    csvInput: { minHeight: 96, paddingTop: spacing.md, textAlignVertical: 'top', fontSize: 13 },
    storedText: { fontSize: 14, color: colors.textSecondary },
    deleteRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
    deleteText: { fontSize: 15, color: colors.danger, fontWeight: '600' },
    deleteTextDisabled: { color: colors.textTertiary },
    disclaimer: { fontSize: 12, color: colors.warn, lineHeight: 17, marginTop: spacing.xl },
  });
