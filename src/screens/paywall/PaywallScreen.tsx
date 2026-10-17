import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { IconBubble, Card } from '@/components/primitives';
import { Button } from '@/components/Button';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { useT } from '@/i18n';

/**
 * MOCK paywall. There is NO real payment / in-app-purchase SDK in this build.
 * The "Premium freischalten" button flips the dev premium flag so the premium
 * UI can be tested end-to-end without a purchase.
 */
export function PaywallScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const t = useT();
  const navigation = useNavigation<any>();
  const isPremium = useAppStore((s) => s.isPremium);
  const setPremium = useAppStore((s) => s.setPremium);

  return (
    <Screen>
      <View style={styles.header}>
        <IconBubble name="premium" size={30} />
        <Text style={styles.title}>Dialy Premium</Text>
        <Text style={styles.price}>{t.paywall.price}</Text>
      </View>

      <Card>
        {t.paywall.features.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Icon name="radioOn" size={20} color={colors.accent} />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </Card>

      <Text style={styles.renewal}>{t.paywall.renewal}</Text>
      <Text style={styles.legalLinks}>
        <Text style={styles.legalLink} onPress={() => navigation.navigate('Terms')}>
          {t.common.termsOfUse}
        </Text>
        {'  ·  '}
        <Text style={styles.legalLink} onPress={() => navigation.navigate('Privacy')}>
          {t.common.privacyPolicy}
        </Text>
      </Text>

      <Text style={styles.mockNote}>{t.paywall.mockNote}</Text>

      {isPremium ? (
        <Button
          title={t.paywall.active}
          icon="check"
          onPress={() => navigation.goBack()}
          disabled
          style={styles.btn}
        />
      ) : (
        <Button
          title={t.paywall.unlock}
          icon="premium"
          onPress={() => {
            setPremium(true);
            navigation.goBack();
          }}
          style={styles.btn}
        />
      )}
    </Screen>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    header: { alignItems: 'center', marginVertical: spacing.lg },
    title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md },
    price: { fontSize: 18, color: colors.accent, fontWeight: '700', marginTop: spacing.xs },
    featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
    featureText: { fontSize: 16, color: colors.textPrimary, marginLeft: spacing.md },
    renewal: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: spacing.lg,
      lineHeight: 18,
      textAlign: 'center',
    },
    legalLinks: { fontSize: 13, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.sm },
    legalLink: { textDecorationLine: 'underline' },
    mockNote: {
      fontSize: 13,
      color: colors.textTertiary,
      marginTop: spacing.lg,
      lineHeight: 18,
      textAlign: 'center',
    },
    btn: { marginTop: spacing.xl },
  });
