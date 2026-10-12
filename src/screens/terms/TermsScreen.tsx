import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { spacing, type Colors } from '@/theme/theme';
import { useThemedStyles } from '@/theme/useTheme';
import { useT } from '@/i18n';

/**
 * Terms of use. Copy: t.terms; bump TERMS_VERSION (legal/terms) whenever the
 * text changes materially.
 */
export function TermsScreen() {
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  return (
    <Screen>
      <Text style={styles.title}>{t.terms.title}</Text>
      <Text style={styles.version}>{t.terms.version}</Text>
      {t.terms.sections.map((s) => (
        <React.Fragment key={s.h}>
          <Text style={styles.h}>{s.h}</Text>
          <Text style={styles.b}>{s.b}</Text>
        </React.Fragment>
      ))}
    </Screen>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary },
    version: { fontSize: 13, color: colors.textTertiary, marginTop: spacing.xs, marginBottom: spacing.lg },
    h: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.lg },
    b: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginTop: spacing.sm },
  });
