import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '@/state/store';
import type { LoginReturnTo } from '@/navigation/types';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { Icon } from '@/components/Icon';
import { useT } from '@/i18n';

/**
 * Inline gating note shown when a user without a subscription tries a gated
 * action (save to diary). Logged out it leads to sign-in, signed in to
 * Premium.
 */
export function GateNotice({ message, returnTo }: { message: string; returnTo: LoginReturnTo }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const navigation = useNavigation<any>();
  const loggedIn = useAppStore((s) => s.user) !== null;
  return (
    <View style={styles.container}>
      <Icon name="lock" size={18} color={colors.warn} style={styles.icon} />
      <View style={styles.flex}>
        <Text style={styles.message}>{message}</Text>
        <Pressable
          onPress={() =>
            loggedIn
              ? navigation.navigate('Login', { screen: 'Paywall' })
              : navigation.navigate('Login', { screen: 'LoginHome', params: { returnTo } })
          }
          accessibilityRole="link"
        >
          <Text style={styles.cta}>
            {loggedIn ? t.gate.premiumCta : t.gate.loginCta}{' '}
            <Icon name="chevronRight" size={15} color={colors.accent} />
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.bgSurfaceAlt,
      borderRadius: radius.card,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
    },
    icon: { marginRight: spacing.md, marginTop: 2 },
    flex: { flex: 1 },
    message: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
    cta: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.accent,
      marginTop: spacing.sm,
    },
  });
