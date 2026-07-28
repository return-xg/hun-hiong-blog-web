/** 登录请求 */
export interface LoginRequest {
  username: string;
  password: string;
}

/** 注册请求 */
export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

/** Token 响应 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  userInfo?: AuthUser;
}

/** 用户信息（认证相关） */
export interface AuthUser {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  status?: number;
  createTime?: string;
}
