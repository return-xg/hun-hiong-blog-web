import type { Tag } from './tag';

/** 文章 */
export interface Article {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  coverUrl?: string;
  categoryId?: string;
  categoryName?: string;
  tags?: Tag[];
  /** 状态：0-草稿，1-已发布 */
  status: number;
  viewCount: number;
  likeCount: number;
  createTime: string;
  updateTime: string;
}

/** 文章查询参数 */
export interface ArticleQuery {
  current?: number;
  size?: number;
  title?: string;
  categoryId?: string | number;
  tagId?: string | number;
  status?: number;
}
