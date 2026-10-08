import React from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && (isPrimary ? styles.primaryPressed : styles.secondaryPressed),
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.textOnAccent : colors.accent} />
      ) : (
        <View style={styles.row}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={isPrimary ? colors.textOnAccent : colors.accent}
              style={styles.icon}
            />
          )}
          <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    base: {
      minHeight: 48,
      borderRadius: radius.button,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    icon: { marginRight: spacing.sm },
    primary: { backgroundColor: colors.accent },
    primaryPressed: { backgroundColor: colors.accentPressed },
    secondary: { backgroundColor: colors.bgSurfaceAlt },
    secondaryPressed: { backgroundColor: colors.bgInput },
    disabled: { opacity: 0.5 },
    label: { fontSize: 16, fontWeight: '700' },
    labelPrimary: { color: colors.textOnAccent },
    labelSecondary: { color: colors.accent },
  });
