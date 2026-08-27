import type { Tag } from './tag';

/** 搜索请求参数 */
export interface SearchArticlesParams {
  keyword: string;
  page?: number;
  pageSize?: number;
}

/** 搜索结果中的文章 */
export interface ArticleSearchItem {
  id: string;
  title: string;
  summary: string | null;
  coverUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  tags: Tag[];
  viewCount: number;
  likeCount: number;
  createTime: string;
  updateTime: string;
  /** 搜索相关度，前端暂不展示 */
  score: number;
}
