import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { IconBubble, Card, SectionLabel } from '@/components/primitives';
import { ThemeModeControl } from '@/components/SegmentedControl';
import { Button } from '@/components/Button';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useAppStore, type SyncStatus } from '@/state/store';
import { authService } from '@/services/auth';
import { syncEngine } from '@/sync/syncEngine';
import { isSupabaseConfigured } from '@/config';
import { formatDate, formatTime } from '@/utils/format';

/** Account state shown on the Login tab once signed in. */
export function AccountView() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const navigation = useNavigation<any>();
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const isPremium = useAppStore((s) => s.isPremium);
  const togglePremiumDev = useAppStore((s) => s.togglePremiumDev);
  const syncStatus = useAppStore((s) => s.syncStatus);
  const lastSyncedAt = useAppStore((s) => s.lastSyncedAt);
  // Re-render every 30 s so "vor 2 Min." stays current.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  const sync = describeSync(isSupabaseConfigured(), syncStatus, lastSyncedAt, now);

  const logout = async () => {
    await authService.signOut();
    syncEngine.reset();
    setUser(null);
  };

  const deleteData = () => {
    Alert.alert(
      'Daten löschen',
      'Möchtest du wirklich alle deine Einträge (Mahlzeiten, Sport, Blutzucker) unwiderruflich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            const { error } = await authService.deleteAccountData(user.id);
            Alert.alert(
              error ? 'Teilweise gelöscht' : 'Gelöscht',
              error
                ? 'Lokale Daten wurden gelöscht. Die Server-Löschung folgt beim nächsten Sync.'
                : 'Alle deine Einträge wurden gelöscht.'
            );
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <View style={styles.header}>
        <IconBubble name="person-circle" size={30} />
        <Text style={styles.email}>{user?.email || 'Angemeldet'}</Text>
        <View style={[styles.badge, isPremium ? styles.badgePremium : styles.badgeFree]}>
          <Text style={[styles.badgeText, isPremium && styles.badgeTextPremium]}>
            {isPremium ? 'Premium' : 'Kostenloses Konto'}
          </Text>
        </View>
      </View>

      {/* Dev-only premium toggle (no real IAP in this build). Long-press the
          row to flip the premium flag and test the premium UI. */}
      <SectionLabel>Premium</SectionLabel>
      <Pressable onLongPress={togglePremiumDev} delayLongPress={500}>
        <Card>
          <View style={styles.row}>
            <Ionicons name="star" size={20} color={colors.accent} />
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Dialy Premium (CHF 3.00 / Monat)</Text>
              <Text style={styles.rowSub}>
                Vollständiges Tagebuch & Blutzucker-Auswertung.
              </Text>
            </View>
          </View>
          <Button
            title="Premium ansehen"
            variant="secondary"
            onPress={() => navigation.navigate('Paywall')}
            style={{ marginTop: spacing.md }}
          />
          <Text style={styles.devHint}>
            Dev: Diese Karte lange drücken, um Premium zum Testen umzuschalten.
          </Text>
        </Card>
      </Pressable>

      <SectionLabel style={styles.spaced}>Darstellung</SectionLabel>
      <ThemeModeControl />

      <SectionLabel style={styles.spaced}>Datenschutz</SectionLabel>
      <Card>
        <Pressable style={styles.linkRow} onPress={() => navigation.navigate('Privacy')}>
          <Text style={styles.linkText}>Datenschutzerklärung</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </Pressable>
        <Pressable style={styles.linkRow} onPress={deleteData}>
          <Text style={[styles.linkText, { color: colors.danger }]}>Daten löschen</Text>
          <Ionicons name="trash" size={18} color={colors.danger} />
        </Pressable>
      </Card>

      {/* Sync runs automatically (after every change, on start and foreground,
          retrying while offline); this only shows how it's going. */}
      <SectionLabel style={styles.spaced}>Synchronisierung</SectionLabel>
      <Card>
        <View style={styles.row} accessibilityLiveRegion="polite">
          <Ionicons name={sync.icon} size={20} color={sync.warn ? colors.warn : colors.accent} />
          <Text style={[styles.rowBody, styles.syncText]}>{sync.text}</Text>
        </View>
      </Card>

      <Button
        title="Abmelden"
        icon="log-out"
        variant="secondary"
        onPress={logout}
        style={{ marginTop: spacing.xl }}
      />
    </Screen>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    header: { alignItems: 'center', marginVertical: spacing.lg },
    email: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md },
    badge: {
      paddingHorizontal: spacing.md,
      paddingVertical: 4,
      borderRadius: radius.pill,
      marginTop: spacing.sm,
    },
    badgeFree: { backgroundColor: colors.bgSurfaceAlt },
    badgePremium: { backgroundColor: colors.accentSubtle, borderWidth: 1, borderColor: colors.accent },
    badgeText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
    badgeTextPremium: { color: colors.accent },
    spaced: { marginTop: spacing.xl },
    syncText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
    row: { flexDirection: 'row', alignItems: 'center' },
    rowBody: { flex: 1, marginLeft: spacing.md },
    rowTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    rowSub: { fontSize: 13, color: colors.textTertiary, marginTop: 2 },
    devHint: { fontSize: 12, color: colors.textTertiary, marginTop: spacing.md, fontStyle: 'italic' },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
    },
    linkText: { fontSize: 16, color: colors.textPrimary },
  });

/** Icon + sentence for the sync status card. */
function describeSync(
  configured: boolean,
  status: SyncStatus,
  lastSyncedAt: string | null,
  now: number
): { icon: keyof typeof Ionicons.glyphMap; text: string; warn: boolean } {
  if (!configured || status.state === 'disabled') {
    return {
      icon: 'phone-portrait-outline',
      text: 'Offline-Modus: Es ist kein Server konfiguriert. Alle Daten bleiben lokal auf dem Gerät.',
      warn: false,
    };
  }
  const n = status.pending;
  const waiting = n === 1 ? '1 Änderung wartet' : `${n} Änderungen warten`;
  switch (status.state) {
    case 'syncing':
      return { icon: 'sync-outline', text: 'Synchronisiere …', warn: false };
    case 'offline':
      return {
        icon: 'cloud-offline-outline',
        text:
          n > 0
            ? `Keine Verbindung – ${waiting} und ${n === 1 ? 'wird' : 'werden'} automatisch nachgeschickt.`
            : 'Keine Verbindung – deine Einträge sind auf dem Gerät gespeichert.',
        warn: true,
      };
    case 'error':
      return {
        icon: 'alert-circle-outline',
        text: 'Synchronisierung fehlgeschlagen – wird automatisch erneut versucht.',
        warn: true,
      };
    default:
      if (n > 0) return { icon: 'time-outline', text: `${waiting} auf die Synchronisierung.`, warn: false };
      return {
        icon: 'cloud-done-outline',
        text: lastSyncedAt
          ? `Alles synchronisiert · ${sinceText(lastSyncedAt, now)}`
          : 'Noch nicht synchronisiert.',
        warn: false,
      };
  }
}

/** "gerade eben", "vor 5 Min.", "heute, 14:05" or "3. Oktober 2026, 14:05". */
function sinceText(iso: string, now: number): string {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'gerade eben';
  if (minutes < 60) return `vor ${minutes} Min.`;
  const sameDay = new Date(iso).toDateString() === new Date(now).toDateString();
  return `${sameDay ? 'heute' : formatDate(iso)}, ${formatTime(iso)}`;
}
