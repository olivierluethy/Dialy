import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { IconBubble } from '@/components/primitives';
import { colors, spacing } from '@/theme/theme';
import { articlesRepo } from '@/db/repositories/articles';
import { formatDate } from '@/utils/format';
import type { Article } from '@/types/models';
import type { RatgeberStackParamList } from '@/navigation/types';

export function ArticleDetailScreen({
  route,
}: {
  route: RouteProp<RatgeberStackParamList, 'ArticleDetail'>;
}) {
  const { id } = route.params;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    articlesRepo.byId(id).then((a) => {
      setArticle(a);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xxl }} />
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

const styles = StyleSheet.create({
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
