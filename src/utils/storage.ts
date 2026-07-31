const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const VIEW_INCREMENT_PREFIX = 'viewIncr_';

export const storage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

/** 阅读量本地增量跟踪（基于 sessionStorage，弥合后端 5 分钟批量同步的延迟） */
export const viewCountTracker = {
  /**
   * 记录一次阅读量增量
   * @param articleId 文章 ID
   * @param baseViewCount 记录时的数据库 viewCount 基准值
   */
  recordIncrement(articleId: string | number, baseViewCount: number): void {
    const key = `${VIEW_INCREMENT_PREFIX}${articleId}`;
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as { increment: number; baseViewCount: number };
      // 基准值已变（DB 已同步），重置为新的基准
      if (parsed.baseViewCount !== baseViewCount) {
        sessionStorage.setItem(key, JSON.stringify({ increment: 1, baseViewCount }));
      } else {
        sessionStorage.setItem(key, JSON.stringify({ increment: parsed.increment + 1, baseViewCount }));
      }
    } else {
      sessionStorage.setItem(key, JSON.stringify({ increment: 1, baseViewCount }));
    }
  },

  /**
   * 将本地增量合并到文章列表的 viewCount
   * @param articles 文章列表（从服务端获取）
   * @returns 合并增量后的文章列表
   */
  mergeInto<T extends { id: string | number; viewCount?: number }>(articles: T[]): T[] {
    return articles.map((article) => {
      const key = `${VIEW_INCREMENT_PREFIX}${article.id}`;
      const raw = sessionStorage.getItem(key);
      if (!raw) return article;

      const { increment, baseViewCount } = JSON.parse(raw) as { increment: number; baseViewCount: number };
      const dbViewCount = article.viewCount ?? 0;

      // DB 值已更新（定时任务已同步），本地增量过期，清除
      if (dbViewCount !== baseViewCount) {
        sessionStorage.removeItem(key);
        return article;
      }

      // DB 未同步，叠加本地增量
      return { ...article, viewCount: dbViewCount + increment };
    });
  },
};
