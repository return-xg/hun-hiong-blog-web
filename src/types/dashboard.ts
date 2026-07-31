/** 仪表盘概览统计 */
export interface DashboardOverview {
  articleCount: number;
  categoryCount: number;
  tagCount: number;
  viewCount: number;
  likeCount: number;
}

/** 每日浏览趋势数据点 */
export interface DailyViewTrend {
  date: string;
  viewCount: number;
}

/** 最近文章 */
export interface RecentArticle {
  id: string;
  title: string;
  categoryName?: string;
  viewCount: number;
  createTime: string;
}
