import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { IconBubble, Card, SectionLabel } from '@/components/primitives';
import { ThemeModeControl } from '@/components/SegmentedControl';
import { Button } from '@/components/Button';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { authService } from '@/services/auth';
import { syncEngine } from '@/sync/syncEngine';
import { isSupabaseConfigured } from '@/config';

/** Account state shown on the Login tab once signed in. */
export function AccountView() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const navigation = useNavigation<any>();
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const isPremium = useAppStore((s) => s.isPremium);
  const togglePremiumDev = useAppStore((s) => s.togglePremiumDev);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const logout = async () => {
    await authService.signOut();
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
            const { error } = await authService.deleteAccountData();
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

  const syncNow = async () => {
    setSyncMsg('Synchronisiere…');
    const res = await syncEngine.syncNow();
    if (res.error === 'offline') {
      setSyncMsg('Offline-Modus – kein Server konfiguriert.');
    } else if (res.error) {
      setSyncMsg('Sync nicht möglich.');
    } else {
      setSyncMsg(`Synchronisiert: ${res.pushed} gesendet, ${res.pulled} empfangen.`);
    }
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

      <SectionLabel>Konto</SectionLabel>
      <Card>
        <Button title="Jetzt synchronisieren" icon="sync" variant="secondary" onPress={syncNow} />
        {syncMsg && <Text style={styles.syncMsg}>{syncMsg}</Text>}
        {!isSupabaseConfigured() && (
          <Text style={styles.offlineNote}>
            Offline-Modus: Es ist kein Supabase-Server konfiguriert. Alle Daten
            bleiben lokal auf dem Gerät.
          </Text>
        )}
      </Card>

      {/* Dev-only premium toggle (no real IAP in this build). Long-press the
          row to flip the premium flag and test the premium UI. */}
      <SectionLabel style={styles.spaced}>Premium</SectionLabel>
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
    syncMsg: { color: colors.textSecondary, fontSize: 13, marginTop: spacing.md },
    offlineNote: { color: colors.textTertiary, fontSize: 13, marginTop: spacing.md, lineHeight: 18 },
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
