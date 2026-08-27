import request from './request';
import type { Result, PageResult } from '@/types/api';
import type { SearchArticlesParams, ArticleSearchItem } from '@/types/search';

/** 搜索文章（分页） */
export function searchArticles(params: SearchArticlesParams): Promise<Result<PageResult<ArticleSearchItem>>> {
  return request.get('/search/articles', { params });
}
