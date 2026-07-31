import type { Tag } from './tag';

/** 仪表盘概览统计 */
export interface DashboardOverview {
  articleCount: number;
  categoryCount: number;
  tagCount: number;
  viewCount: number;
  likeCount: number;
}

/** 分类文章分布 */
export interface CategoryDistribution {
  categoryName: string;
  articleCount: number;
}

/** 热门文章（按浏览量 Top 5） */
export interface TopArticle {
  id: string;
  title: string;
  viewCount: number;
}

/** 最近文章 */
export interface RecentArticle {
  id: string;
  title: string;
  categoryName?: string;
  category_name?: string;
  tags?: Tag[];
  viewCount: number;
  createTime?: string;
  create_time?: string;
}
