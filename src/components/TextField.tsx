import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing } from '@/theme/theme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  focusedHighlight?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

/** Dark text input with optional uppercase label and focus highlight. */
export function TextField({
  label,
  focusedHighlight = false,
  containerStyle,
  style,
  ...rest
}: TextFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, focusedHighlight && styles.inputHighlight, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.bgInput,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputHighlight: { borderColor: colors.accent },
});
