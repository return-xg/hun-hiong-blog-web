import request from './request';
import type { Result, PageResult } from '@/types/api';
import type { Tag } from '@/types/tag';

/** 分页查询标签 */
export function getTagList(params?: { current?: number; size?: number; name?: string }): Promise<Result<PageResult<Tag>>> {
  return request.get('/tag/page', { params });
}

/** 获取全部标签列表 */
export function getAllTags(): Promise<Result<Tag[]>> {
  return request.get('/tag/list');
}

/** 创建标签 */
export function createTag(data: Partial<Tag>): Promise<Result<void>> {
  return request.post('/tag', data);
}

/** 更新标签 */
export function updateTag(id: number, data: Partial<Tag>): Promise<Result<void>> {
  return request.put(`/tag/${id}`, data);
}

/** 删除标签 */
export function deleteTag(id: number): Promise<Result<void>> {
  return request.delete(`/tag/${id}`);
}

/** 批量删除标签 */
export function batchDeleteTags(ids: number[]): Promise<Result<void>> {
  return request.delete('/tag/batch', { data: ids });
}
