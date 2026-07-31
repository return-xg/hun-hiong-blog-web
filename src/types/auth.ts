/** 登录请求 */
export interface LoginRequest {
  username: string;
  password: string;
}

/** 注册请求 */
export interface RegisterRequest {
  username: string;
  password: string;
  nickname?: string;
}

/** 登录/注册响应（返回 Token 字符串） */
export type TokenResponse = string;

/** 刷新 Token 响应 */
export interface LoginVO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userInfo: AuthUser;
}

/** 用户信息（认证相关） */
export interface AuthUser {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  /** 角色：admin-管理员，user-普通用户 */
  role?: string;
  status?: number;
  createTime?: string;
}
