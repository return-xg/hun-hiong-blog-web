import request from './request';
import type { Result } from '@/types/api';
import type { DashboardOverview, CategoryDistribution, TopArticle, RecentArticle } from '@/types/dashboard';

/** 获取仪表盘概览统计 */
export function getDashboardOverview(): Promise<Result<DashboardOverview>> {
  return request.get('/dashboard/overview');
}

/** 获取分类文章分布 */
export function getCategoryDistribution(): Promise<Result<CategoryDistribution[]>> {
  return request.get('/dashboard/category-distribution');
}

/** 获取热门文章 Top 5 */
export function getTopArticles(): Promise<Result<TopArticle[]>> {
  return request.get('/dashboard/top-articles');
}

/** 获取最近文章 */
export function getRecentArticles(): Promise<Result<RecentArticle[]>> {
  return request.get('/dashboard/recent-articles');
}
