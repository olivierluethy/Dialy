import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { spacing, type Colors } from '@/theme/theme';
import { useThemedStyles } from '@/theme/useTheme';

/** Placeholder privacy policy (German). Replace with the final legal text. */
const SECTIONS: Array<{ h: string; b: string }> = [
  {
    h: 'Überblick',
    b: 'Dialy ist ein Begleiter für den Alltag mit Diabetes. Die App dokumentiert Werte, die du selbst eingibst, und schätzt Kohlenhydrate sowie einen illustrativen Blutzucker-Trend. Dialy ist kein Medizinprodukt und gibt keine Therapie- oder Dosierungsempfehlungen.',
  },
  {
    h: 'Welche Daten wir verarbeiten',
    b: 'Mahlzeiten, sportliche Aktivitäten und Blutzuckerwerte, die du eingibst. Diese Gesundheitsdaten gelten als besonders schützenswert (DSGVO Art. 9 / revDSG Art. 5). Sie werden ausschliesslich zur Bereitstellung des Tagebuchs verwendet.',
  },
  {
    h: 'Keine Werbe- oder Analysenutzung',
    b: 'Deine Gesundheitsdaten werden nicht für Werbung, Marketing oder Data-Mining verwendet und nicht an Dritte verkauft.',
  },
  {
    h: 'Speicherung',
    b: 'Deine Daten werden lokal auf deinem Gerät gespeichert. Mit einem Konto werden sie verschlüsselt mit unserem Server synchronisiert, damit sie auf mehreren Geräten verfügbar sind. Der Zugriff ist durch Row-Level-Security auf dein Konto beschränkt.',
  },
  {
    h: 'Deine Rechte',
    b: 'Du kannst deine Daten jederzeit in den Kontoeinstellungen unter «Daten löschen» vollständig entfernen. Die Löschung wird auch auf den Server übertragen.',
  },
  {
    h: 'Quellen',
    b: 'Nährwerte der meisten Lebensmittel im KH-Rechner: Schweizer Nährwertdatenbank, Bundesamt für Lebensmittelsicherheit und Veterinärwesen (BLV), naehrwertdaten.ch.',
  },
  {
    h: 'Kontakt',
    b: 'Bei Fragen zum Datenschutz erreichst du uns unter datenschutz@dialy.example. (Platzhalter)',
  },
];

export function PrivacyScreen() {
  const styles = useThemedStyles(makeStyles);
  return (
    <Screen>
      <Text style={styles.title}>Datenschutzerklärung</Text>
      {SECTIONS.map((s) => (
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
    title: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.lg },
    h: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.lg },
    b: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginTop: spacing.sm },
  });
