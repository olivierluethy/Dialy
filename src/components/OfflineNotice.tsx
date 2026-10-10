import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Card, IconBubble } from '@/components/primitives';
import { Button } from '@/components/Button';
import { spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';

/** Card explaining that online-only content can't be shown, with a retry. */
export function OfflineNotice({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Card style={styles.card}>
      <IconBubble name="cloud-offline-outline" color={colors.warn} bg={colors.bgSurfaceAlt} />
      <Text style={styles.text}>{message}</Text>
      {onRetry && (
        <Button
          title="Erneut versuchen"
          icon="refresh"
          variant="secondary"
          onPress={onRetry}
          style={styles.retry}
        />
      )}
    </Card>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    card: { alignItems: 'center', marginTop: spacing.sm },
    text: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 21,
      marginTop: spacing.md,
    },
    retry: { marginTop: spacing.lg, alignSelf: 'stretch' },
  });
