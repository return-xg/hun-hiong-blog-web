import request from './request';
import type { Result } from '@/types/api';
import type { LoginRequest, RegisterRequest, LoginVO, AuthUser, UpdateProfileRequest, ChangePasswordRequest } from '@/types/auth';

/** 登录 */
export function login(data: LoginRequest): Promise<Result<LoginVO>> {
  return request.post('/auth/login', data);
}

/** 注册 */
export function register(data: RegisterRequest): Promise<Result<string>> {
  return request.post('/auth/register', data);
}

/** 刷新 Token */
export function refreshToken(): Promise<Result<LoginVO>> {
  return request.get('/auth/refresh');
}

/** 获取当前用户信息 */
export function getCurrentUser(): Promise<Result<AuthUser>> {
  return request.get('/auth/info');
}

/** 修改个人信息 */
export function updateProfile(data: UpdateProfileRequest): Promise<Result<AuthUser>> {
  return request.put('/auth/profile', data);
}

/** 修改密码 */
export function changePassword(data: ChangePasswordRequest): Promise<Result<void>> {
  return request.put('/auth/password', data);
}
