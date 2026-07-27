import request from './request';
import type { Result, PageResult } from '@/types/api';
import type { Category } from '@/types/category';

/** 获取分类列表 */
export function getCategoryList(params?: { current?: number; size?: number }): Promise<Result<PageResult<Category>>> {
  return request.get('/categories', { params });
}

/** 获取分类详情 */
export function getCategoryDetail(id: number): Promise<Result<Category>> {
  return request.get(`/categories/${id}`);
}

/** 创建分类 */
export function createCategory(data: Partial<Category>): Promise<Result<Category>> {
  return request.post('/categories', data);
}

/** 更新分类 */
export function updateCategory(id: number, data: Partial<Category>): Promise<Result<Category>> {
  return request.put(`/categories/${id}`, data);
}

/** 删除分类 */
export function deleteCategory(id: number): Promise<Result<void>> {
  return request.delete(`/categories/${id}`);
}
