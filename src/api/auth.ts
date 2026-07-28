import request from './request';
import type { Result } from '@/types/api';
import type { LoginRequest, RegisterRequest, TokenResponse, AuthUser } from '@/types/auth';

/** 登录 */
export function login(data: LoginRequest): Promise<Result<TokenResponse>> {
  return request.post('/auth/login', data);
}

/** 注册 */
export function register(data: RegisterRequest): Promise<Result<TokenResponse>> {
  return request.post('/auth/register', data);
}

/** 刷新 Token */
export function refreshToken(refreshToken: string): Promise<Result<TokenResponse>> {
  return request.post('/auth/refresh', { refreshToken });
}

/** 获取当前用户信息 */
export function getCurrentUser(): Promise<Result<AuthUser>> {
  return request.get('/auth/info');
}
