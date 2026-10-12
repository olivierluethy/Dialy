import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '@/state/store';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useT } from '@/i18n';

/**
 * Inline gating note shown when a user without a subscription tries a gated
 * action (save to diary). Logged out it leads to sign-in, signed in to
 * Premium.
 */
export function GateNotice({ message }: { message: string }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const navigation = useNavigation<any>();
  const loggedIn = useAppStore((s) => s.user) !== null;
  return (
    <View style={styles.container}>
      <Ionicons name="lock-closed" size={18} color={colors.warn} style={styles.icon} />
      <View style={styles.flex}>
        <Text style={styles.message}>{message}</Text>
        <Pressable
          onPress={() =>
            navigation.navigate('Login', { screen: loggedIn ? 'Paywall' : 'LoginHome' })
          }
          accessibilityRole="link"
        >
          <Text style={styles.cta}>{loggedIn ? t.gate.premiumCta : t.gate.loginCta}</Text>
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
