import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { DiabetesTypeControl } from '@/components/SegmentedControl';
import { ScreenTitle, IconBubble } from '@/components/primitives';
import { Icon, type IconName } from '@/components/Icon';
import { FadeIn, staggerDelay } from '@/components/FadeIn';
import { radius, spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { useAppStore } from '@/state/store';
import { OfflineNotice } from '@/components/OfflineNotice';
import { articlesErrorText, articlesService, type ArticlesError } from '@/services/articles';
import { formatDate } from '@/utils/format';
import { useLanguage, useT } from '@/i18n';
import type { Article } from '@/types/models';
import type { RatgeberStackParamList } from '@/navigation/types';

// Map article categories to icons. Unknown categories fall back to a book.
const CATEGORY_ICON: Record<string, IconName> = {
  Sport: 'activityRun',
  Nacht: 'catNight',
  Insulin: 'catInsulin',
  Technologie: 'catTech',
  Ernährung: 'catNutrition',
  Medikamente: 'catMeds',
  Alltag: 'catEveryday',
  Sicherheit: 'catSafety',
};

export function RatgeberScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  // Shared with the settings: the last choice is shown next time.
  const type = useAppStore((s) => s.diabetesType);
  const t = useT();
  const language = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<ArticlesError | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadTick, setReloadTick] = useState(0);
  const navigation =
    useNavigation<NativeStackNavigationProp<RatgeberStackParamList>>();

  // Loaded live from Supabase whenever the screen refocuses or the diabetes
  // type changes; offline there are simply no articles.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      articlesService.forType(type).then((result) => {
        if (!active) return;
        if ('data' in result) {
          setArticles(result.data);
          setError(null);
        } else {
          setArticles([]);
          setError(result.error);
        }
        setLoading(false);
      });
      return () => {
        active = false;
      };
    }, [type, reloadTick])
  );

  return (
    <Screen contentStyle={styles.content}>
      <ScreenTitle>{t.ratgeber.title}</ScreenTitle>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
      ) : error ? (
        <OfflineNotice
          message={articlesErrorText(error)}
          onRetry={error === 'not-configured' ? undefined : () => setReloadTick((n) => n + 1)}
        />
      ) : articles.length === 0 ? (
        <Text style={styles.empty}>{t.ratgeber.empty}</Text>
      ) : (
        <>
        {/* Articles are written in German only (so far). */}
        {language !== 'de' && <Text style={styles.germanOnly}>{t.ratgeber.germanOnly}</Text>}
        {articles.map((a, i) => (
          <FadeIn key={a.id} delay={staggerDelay(i)}>
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('ArticleDetail', { id: a.id })}
              accessibilityRole="button"
            >
              <IconBubble name={CATEGORY_ICON[a.category] ?? 'book'} />
              <View style={styles.cardBody}>
                <Text style={styles.category}>
                  {(t.ratgeber.categories[a.category] ?? a.category).toUpperCase()}
                </Text>
                <Text style={styles.title} numberOfLines={2}>
                  {a.title}
                </Text>
                <Text style={styles.meta}>
                  {a.read_minutes} min · {formatDate(a.published_at)}
                </Text>
              </View>
              <Icon name="chevronRight" size={20} color={colors.textTertiary} />
            </Pressable>
          </FadeIn>
        ))}
        </>
      )}
      <View style={styles.typeFooter}>
        <DiabetesTypeControl />
      </View>
    </Screen>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    content: { flexGrow: 1 },
    typeFooter: { marginTop: 'auto', paddingTop: spacing.lg },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.bgSurface,
      borderRadius: radius.card,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      marginBottom: spacing.md,
    },
    cardBody: { flex: 1, marginHorizontal: spacing.md },
    empty: { color: colors.textTertiary, fontSize: 15, marginTop: spacing.lg },
    germanOnly: { color: colors.textTertiary, fontSize: 13, marginBottom: spacing.md },
    category: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1,
      color: colors.accent,
      marginBottom: 2,
    },
    title: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, lineHeight: 21 },
    meta: { fontSize: 13, color: colors.textTertiary, marginTop: spacing.xs },
  });
