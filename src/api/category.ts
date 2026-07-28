import request from './request';
import type { Result, PageResult } from '@/types/api';
import type { Category } from '@/types/category';

/** 分页查询分类 */
export function getCategoryList(params?: { current?: number; size?: number }): Promise<Result<PageResult<Category>>> {
  return request.get('/category/page', { params });
}

/** 获取分类详情 */
export function getCategoryDetail(id: string): Promise<Result<Category>> {
  return request.get(`/category/${id}`);
}

/** 创建分类 */
export function createCategory(data: Partial<Category>): Promise<Result<void>> {
  return request.post('/category', data);
}

/** 更新分类 */
export function updateCategory(id: string, data: Partial<Category>): Promise<Result<void>> {
  return request.put(`/category/${id}`, data);
}

/** 删除分类（批量） */
export function deleteCategory(ids: string[]): Promise<Result<void>> {
  return request.delete('/category/batch', { data: ids });
}
