import request from './request';
import type { Result, PageResult } from '@/types/api';
import type { User } from '@/types/user';

/** 获取用户列表 */
export function getUserList(params?: { current?: number; size?: number }): Promise<Result<PageResult<User>>> {
  return request.get('/users', { params });
}

/** 获取用户详情 */
export function getUserDetail(id: number): Promise<Result<User>> {
  return request.get(`/users/${id}`);
}

/** 更新用户 */
export function updateUser(id: number, data: Partial<User>): Promise<Result<User>> {
  return request.put(`/users/${id}`, data);
}

/** 删除用户 */
export function deleteUser(id: number): Promise<Result<void>> {
  return request.delete(`/users/${id}`);
}
