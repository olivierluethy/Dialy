import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { IconBubble } from '@/components/primitives';
import { spacing, type Colors } from '@/theme/theme';
import { useTheme, useThemedStyles } from '@/theme/useTheme';
import { OfflineNotice } from '@/components/OfflineNotice';
import { articlesErrorText, articlesService, type ArticlesError } from '@/services/articles';
import { formatDate } from '@/utils/format';
import type { Article } from '@/types/models';
import type { RatgeberStackParamList } from '@/navigation/types';

export function ArticleDetailScreen({
  route,
}: {
  route: RouteProp<RatgeberStackParamList, 'ArticleDetail'>;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { id } = route.params;
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<ArticlesError | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    articlesService.byId(id).then((result) => {
      if (!active) return;
      if ('data' in result) {
        setArticle(result.data);
        setError(null);
      } else {
        setArticle(null);
        setError(result.error);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id, reloadTick]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xxl }} />
      </Screen>
    );
  }

  if (error && error !== 'unavailable') {
    return (
      <Screen>
        <OfflineNotice
          message={articlesErrorText(error)}
          onRetry={error === 'offline' ? () => setReloadTick((t) => t + 1) : undefined}
        />
      </Screen>
    );
  }

  if (!article) {
    return (
      <Screen>
        <Text style={styles.body}>Artikel nicht gefunden.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <IconBubble name="book" />
      <Text style={styles.category}>{article.category.toUpperCase()}</Text>
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.meta}>
        {article.read_minutes} min · {formatDate(article.published_at)}
      </Text>
      {/* Body is plain paragraphs; markdown rendering can be added later. */}
      {article.body.split('\n').map((line, i) => (
        <Text key={i} style={line.length === 0 ? styles.spacer : styles.body}>
          {line}
        </Text>
      ))}
    </Screen>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    category: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      color: colors.accent,
      marginTop: spacing.md,
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: colors.textPrimary,
      marginTop: spacing.sm,
      lineHeight: 32,
    },
    meta: { fontSize: 13, color: colors.textTertiary, marginVertical: spacing.md },
    body: { fontSize: 16, color: colors.textSecondary, lineHeight: 24 },
    spacer: { height: spacing.md },
  });
