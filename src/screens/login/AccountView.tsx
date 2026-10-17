import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, type IconName } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { IconBubble, Card, SectionLabel } from '@/components/primitives';
import { DiabetesTypeControl, LanguageControl, ThemeModeControl } from '@/components/SegmentedControl';
import { Button } from '@/components/Button';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useAppStore, type SyncStatus } from '@/state/store';
import { authService } from '@/services/auth';
import { syncEngine } from '@/sync/syncEngine';
import { isSupabaseConfigured } from '@/config';
import { formatDate, formatTime } from '@/utils/format';
import { useT, type Dict } from '@/i18n';

/** Einstellungen: account, language, appearance — the Login tab once signed in. */
export function AccountView() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
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
  const sync = describeSync(isSupabaseConfigured(), syncStatus, lastSyncedAt, now, t);

  const logout = async () => {
    await authService.signOut();
    syncEngine.reset();
    setUser(null);
  };

  const deleteData = () => {
    Alert.alert(
      t.account.deleteData,
      t.account.deleteConfirm,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            const { error } = await authService.deleteAccountData(user.id);
            useAppStore.getState().bumpDataRevision();
            Alert.alert(
              error ? t.account.partlyDeleted : t.account.deleted,
              error ? t.account.partlyDeletedMessage : t.account.deletedMessage
            );
          },
        },
      ]
    );
  };

  const deleteAccount = () => {
    Alert.alert(
      t.account.deleteAccount,
      t.account.deleteAccountConfirm,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            const { error } = await authService.deleteAccount(user.id);
            if (error) {
              Alert.alert(t.account.deleteAccountFailed, error);
              return;
            }
            syncEngine.reset();
            setUser(null);
            useAppStore.getState().bumpDataRevision();
            Alert.alert(t.account.accountDeleted, t.account.accountDeletedMessage);
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <View style={styles.header}>
        <IconBubble name="personCircle" size={30} />
        <Text style={styles.email}>{user?.email || t.account.signedIn}</Text>
        <View style={[styles.badge, isPremium ? styles.badgePremium : styles.badgeFree]}>
          <Text style={[styles.badgeText, isPremium && styles.badgeTextPremium]}>
            {isPremium ? t.account.premium : t.account.freeAccount}
          </Text>
        </View>
      </View>

      {/* Dev-only premium toggle (no real IAP in this build). Long-press the
          row to flip the premium flag and test the premium UI. */}
      <SectionLabel>{t.account.premium}</SectionLabel>
      <Pressable onLongPress={togglePremiumDev} delayLongPress={500}>
        <Card>
          <View style={styles.row}>
            <Icon name="premium" size={20} color={colors.accent} />
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>{t.account.premiumTitle}</Text>
              <Text style={styles.rowSub}>{t.account.premiumSub}</Text>
            </View>
          </View>
          <Button
            title={t.account.viewPremium}
            variant="secondary"
            onPress={() => navigation.navigate('Paywall')}
            style={{ marginTop: spacing.md }}
          />
          <Text style={styles.devHint}>{t.account.devHint}</Text>
        </Card>
      </Pressable>

      <SectionLabel style={styles.spaced}>{t.common.diabetesType}</SectionLabel>
      <DiabetesTypeControl />

      <SectionLabel>{t.common.language}</SectionLabel>
      <LanguageControl />

      <SectionLabel>{t.common.appearance}</SectionLabel>
      <ThemeModeControl />

      <SectionLabel style={styles.spaced}>{t.nav.blutzucker}</SectionLabel>
      <Card>
        <Pressable style={styles.linkRow} onPress={() => navigation.navigate('GlucoseImport')}>
          <Text style={styles.linkText}>{t.account.glucoseData}</Text>
          <Icon name="chevronRight" size={18} color={colors.textTertiary} />
        </Pressable>
      </Card>

      <SectionLabel style={styles.spaced}>{t.account.legal}</SectionLabel>
      <Card>
        <Pressable style={styles.linkRow} onPress={() => navigation.navigate('Privacy')}>
          <Text style={styles.linkText}>{t.common.privacyPolicy}</Text>
          <Icon name="chevronRight" size={18} color={colors.textTertiary} />
        </Pressable>
        <Pressable style={styles.linkRow} onPress={() => navigation.navigate('Terms')}>
          <Text style={styles.linkText}>{t.common.termsOfUse}</Text>
          <Icon name="chevronRight" size={18} color={colors.textTertiary} />
        </Pressable>
        <Pressable style={styles.linkRow} onPress={deleteData}>
          <Text style={[styles.linkText, { color: colors.danger }]}>{t.account.deleteData}</Text>
          <Icon name="delete" size={18} color={colors.danger} />
        </Pressable>
        <Pressable style={styles.linkRow} onPress={deleteAccount}>
          <Text style={[styles.linkText, { color: colors.danger }]}>{t.account.deleteAccount}</Text>
          <Icon name="personRemove" size={18} color={colors.danger} />
        </Pressable>
      </Card>

      {/* Sync runs automatically (after every change, on start and foreground,
          retrying while offline); this only shows how it's going. */}
      <SectionLabel style={styles.spaced}>{t.account.sync}</SectionLabel>
      <Card>
        <View style={styles.row} accessibilityLiveRegion="polite">
          <Icon name={sync.icon} size={20} color={sync.warn ? colors.warn : colors.accent} />
          <Text style={[styles.rowBody, styles.syncText]}>{sync.text}</Text>
        </View>
      </Card>

      <Button
        title={t.account.signOut}
        icon="logout"
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
  now: number,
  t: Dict
): { icon: IconName; text: string; warn: boolean } {
  if (!configured || status.state === 'disabled') {
    return {
      icon: 'device',
      text: t.account.syncLocalOnly,
      warn: false,
    };
  }
  const n = status.pending;
  switch (status.state) {
    case 'syncing':
      return { icon: 'syncing', text: t.account.syncing, warn: false };
    case 'offline':
      return {
        icon: 'offline',
        text: n > 0 ? t.account.offlinePending(n) : t.account.offlineSaved,
        warn: true,
      };
    case 'error':
      return {
        icon: 'alert',
        text: t.account.syncFailed,
        warn: true,
      };
    default:
      if (n > 0) return { icon: 'time', text: t.account.pending(n), warn: false };
      return {
        icon: 'synced',
        text: lastSyncedAt
          ? t.account.allSynced(sinceText(lastSyncedAt, now, t))
          : t.account.notSynced,
        warn: false,
      };
  }
}

/** "gerade eben", "vor 5 Min.", "heute, 14:05" or "3. Oktober 2026, 14:05". */
function sinceText(iso: string, now: number, t: Dict): string {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return t.account.justNow;
  if (minutes < 60) return t.account.minutesAgo(minutes);
  const sameDay = new Date(iso).toDateString() === new Date(now).toDateString();
  return `${sameDay ? t.account.today : formatDate(iso)}, ${formatTime(iso)}`;
}
