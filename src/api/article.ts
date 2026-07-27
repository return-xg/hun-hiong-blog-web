import request from './request';
import type { Result, PageResult } from '@/types/api';
import type { Article, ArticleQuery } from '@/types/article';

/** 获取文章列表（分页） */
export function getArticleList(params?: ArticleQuery): Promise<Result<PageResult<Article>>> {
  return request.get('/articles', { params });
}

/** 获取文章详情 */
export function getArticleDetail(id: number): Promise<Result<Article>> {
  return request.get(`/articles/${id}`);
}

/** 创建文章 */
export function createArticle(data: Partial<Article>): Promise<Result<Article>> {
  return request.post('/articles', data);
}

/** 更新文章 */
export function updateArticle(id: number, data: Partial<Article>): Promise<Result<Article>> {
  return request.put(`/articles/${id}`, data);
}

/** 删除文章 */
export function deleteArticle(id: number): Promise<Result<void>> {
  return request.delete(`/articles/${id}`);
}
