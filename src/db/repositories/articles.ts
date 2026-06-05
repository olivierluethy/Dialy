import { getDb } from '@/db/database';
import type { Article, DiabetesType } from '@/types/models';

export const articlesRepo = {
  /** Articles relevant to the selected diabetes type (type-specific + 'both'). */
  async forType(type: DiabetesType): Promise<Article[]> {
    const db = await getDb();
    return db.getAllAsync<Article>(
      `SELECT * FROM articles
       WHERE deleted_at IS NULL AND (diabetes_type = ? OR diabetes_type = 'both')
       ORDER BY published_at DESC`,
      [type]
    );
  },

  async byId(id: string): Promise<Article | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<Article>(
      `SELECT * FROM articles WHERE id = ? AND deleted_at IS NULL`,
      [id]
    );
    return row ?? null;
  },
};
