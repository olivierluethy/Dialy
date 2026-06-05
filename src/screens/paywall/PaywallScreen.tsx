import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { IconBubble, Card } from '@/components/primitives';
import { Button } from '@/components/Button';
import { colors, radius, spacing } from '@/theme/theme';
import { useAppStore } from '@/state/store';

/**
 * MOCK paywall. There is NO real payment / in-app-purchase SDK in this build.
 * The "Premium freischalten" button flips the dev premium flag so the premium
 * UI can be tested end-to-end without a purchase.
 */
const FEATURES = [
  'Vollständiges Tagebuch mit Verlauf',
  'Blutzucker-Tracking & Auswertung',
  'Foto-Funktion für Mahlzeiten',
  'Geräteübergreifende Synchronisation',
];

export function PaywallScreen() {
  const navigation = useNavigation<any>();
  const isPremium = useAppStore((s) => s.isPremium);
  const setPremium = useAppStore((s) => s.setPremium);

  return (
    <Screen>
      <View style={styles.header}>
        <IconBubble name="star" size={30} />
        <Text style={styles.title}>Dialy Premium</Text>
        <Text style={styles.price}>CHF 3.00 / Monat</Text>
      </View>

      <Card>
        {FEATURES.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </Card>

      <Text style={styles.mockNote}>
        Hinweis: In diesem Build ist die Bezahlung nur eine Vorschau. Es ist kein
        echtes Zahlungssystem hinterlegt.
      </Text>

      {isPremium ? (
        <Button
          title="Premium ist aktiv ✓"
          icon="checkmark"
          onPress={() => navigation.goBack()}
          disabled
          style={styles.btn}
        />
      ) : (
        <Button
          title="Premium freischalten (Demo)"
          icon="star"
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

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginVertical: spacing.lg },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.md },
  price: { fontSize: 18, color: colors.accent, fontWeight: '700', marginTop: spacing.xs },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  featureText: { fontSize: 16, color: colors.textPrimary, marginLeft: spacing.md },
  mockNote: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: spacing.lg,
    lineHeight: 18,
    textAlign: 'center',
  },
  btn: { marginTop: spacing.xl },
});
