import request from './request';
import type { Result, PageResult } from '@/types/api';
import type { Tag } from '@/types/tag';

/** 获取标签列表 */
export function getTagList(params?: { current?: number; size?: number }): Promise<Result<PageResult<Tag>>> {
  return request.get('/tags', { params });
}

/** 创建标签 */
export function createTag(data: Partial<Tag>): Promise<Result<Tag>> {
  return request.post('/tags', data);
}

/** 更新标签 */
export function updateTag(id: number, data: Partial<Tag>): Promise<Result<Tag>> {
  return request.put(`/tags/${id}`, data);
}

/** 删除标签 */
export function deleteTag(id: number): Promise<Result<void>> {
  return request.delete(`/tags/${id}`);
}
