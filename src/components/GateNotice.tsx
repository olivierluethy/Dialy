import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { gateCopy } from '@/policy/gating';

/**
 * Inline gating note shown when a logged-out user tries a gated action
 * (save to diary). Offers a free-registration call to action.
 */
export function GateNotice({
  message,
  onRegister,
}: {
  message: string;
  onRegister: () => void;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.container}>
      <Ionicons name="lock-closed" size={18} color={colors.warn} style={styles.icon} />
      <View style={styles.flex}>
        <Text style={styles.message}>{message}</Text>
        <Pressable onPress={onRegister} accessibilityRole="link">
          <Text style={styles.cta}>{gateCopy.registerCta}</Text>
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
