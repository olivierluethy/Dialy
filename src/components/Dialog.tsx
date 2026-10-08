import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useThemedStyles } from '@/theme/useTheme';

export interface DialogAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

/**
 * Small themed popup (title, optional message and custom content, action
 * buttons). Used instead of
 * `Alert.alert`, which renders nothing on web (react-native-web no-op).
 * Tapping the backdrop or the Android back button calls `onClose`.
 */
export function Dialog({
  visible,
  title,
  message,
  children,
  actions,
  onClose,
}: {
  visible: boolean;
  title: string;
  message?: string;
  children?: React.ReactNode;
  actions: DialogAction[];
  onClose: () => void;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Schliessen">
        {/* Inner Pressable swallows taps so they don't close the dialog. */}
        <Pressable style={styles.box} onPress={() => {}} accessibilityRole="alert">
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          {children}
          <View style={styles.actions}>
            {actions.map((a) => (
              <Button
                key={a.label}
                title={a.label}
                variant={a.variant ?? 'secondary'}
                onPress={a.onPress}
                style={styles.action}
              />
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xxl,
    },
    box: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: colors.bgSurface,
      borderRadius: radius.card,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.xl,
    },
    title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    message: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 21,
      marginTop: spacing.sm,
    },
    actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
    action: { flex: 1, paddingHorizontal: spacing.sm },
  });
