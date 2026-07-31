import request from './request';
import type { Result, PageResult } from '@/types/api';
import type { Article, ArticleQuery } from '@/types/article';

/** 获取文章列表（分页） */
export function getArticleList(params?: ArticleQuery): Promise<Result<PageResult<Article>>> {
  return request.get('/article/page', { params });
}

/** 获取文章详情 */
export function getArticleDetail(id: string | number): Promise<Result<Article>> {
  return request.get(`/article/${id}`);
}

/** 创建文章 */
export function createArticle(data: Partial<Article>): Promise<Result<void>> {
  return request.post('/article', data);
}

/** 更新文章 */
export function updateArticle(id: string | number, data: Partial<Article>): Promise<Result<void>> {
  return request.put(`/article/${id}`, data);
}

/** 删除文章 */
export function deleteArticle(id: string | number): Promise<Result<void>> {
  return request.delete('/article/batch', { data: [String(id)] });
}

/** 批量删除文章 */
export function batchDeleteArticles(ids: (string | number)[]): Promise<Result<void>> {
  return request.delete('/article/batch', { data: ids.map(String) });
}

/** 发布文章 */
export function publishArticle(id: string | number): Promise<Result<void>> {
  return request.put(`/article/${id}/publish`);
}

/** 下线文章 */
export function offlineArticle(id: string | number): Promise<Result<void>> {
  return request.put(`/article/${id}/offline`);
}

/** 增加文章浏览量 */
export function incrementArticleView(id: string | number): Promise<Result<void>> {
  return request.post(`/article/${id}/view`);
}

/** 增加文章点赞量 */
export function incrementArticleLike(id: string | number): Promise<Result<void>> {
  return request.post(`/article/${id}/like`);
}
