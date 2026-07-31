import request from './request';
import type { Result } from '@/types/api';
import type { DashboardOverview, DailyViewTrend, RecentArticle } from '@/types/dashboard';

/** 获取仪表盘概览统计 */
export function getDashboardOverview(): Promise<Result<DashboardOverview>> {
  return request.get('/dashboard/overview');
}

/** 获取近 7 天浏览趋势 */
export function getDashboardTrend(): Promise<Result<DailyViewTrend[]>> {
  return request.get('/dashboard/trend');
}

/** 获取最近文章 */
export function getRecentArticles(): Promise<Result<RecentArticle[]>> {
  return request.get('/dashboard/recent-articles');
}
