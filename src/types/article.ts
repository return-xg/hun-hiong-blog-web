import type { Tag } from './tag';

/** 文章 */
export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  coverImage?: string;
  categoryId?: number;
  categoryName?: string;
  tags?: Tag[];
  status: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

/** 文章查询参数 */
export interface ArticleQuery {
  current?: number;
  size?: number;
  title?: string;
  categoryId?: number;
  tagId?: number;
  status?: number;
}
