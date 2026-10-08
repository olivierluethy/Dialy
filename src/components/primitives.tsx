import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, elevation, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';

/** Elevated surface card. */
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useThemedStyles(makeStyles);
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Small uppercase section label in tertiary colour. */
export function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  const styles = useThemedStyles(makeStyles);
  return <Text style={[styles.label, style]}>{children}</Text>;
}

/** Large bold screen title. */
export function ScreenTitle({ children }: { children: React.ReactNode }) {
  const styles = useThemedStyles(makeStyles);
  return <Text style={styles.title}>{children}</Text>;
}

/** Accent-tinted circular icon bubble. */
export function IconBubble({
  name,
  size = 22,
  color,
  bg,
}: {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  bg?: string;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={[styles.bubble, { backgroundColor: bg ?? colors.accentSubtle }]}>
      <Ionicons name={name} size={size} color={color ?? colors.accent} />
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.bgSurface,
      borderRadius: radius.card,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      ...elevation.card,
      shadowColor: colors.shadow,
    },
    label: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      color: colors.textTertiary,
      textTransform: 'uppercase',
      marginBottom: spacing.sm,
    },
    title: {
      fontSize: 30,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: spacing.lg,
    },
    bubble: {
      width: 44,
      height: 44,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
