/** API 基础路径 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/** Token 刷新路径 */
export const AUTH_REFRESH_URL = '/auth/refresh';

/** 公开路径（不需要鉴权） */
export const PUBLIC_PATHS = ['/login', '/register'];

/** 后台管理路径前缀 */
export const ADMIN_PATH_PREFIX = '/admin';

/** 默认分页大小 */
export const DEFAULT_PAGE_SIZE = 10;

/** 文章状态 */
export const ARTICLE_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
} as const;

/** 文章状态文本映射 */
export const ARTICLE_STATUS_MAP: Record<number, string> = {
  [ARTICLE_STATUS.DRAFT]: '草稿',
  [ARTICLE_STATUS.PUBLISHED]: '已发布',
};

/** 用户状态 */
export const USER_STATUS = {
  DISABLED: 0,
  ENABLED: 1,
} as const;

/** 用户状态文本映射 */
export const USER_STATUS_MAP: Record<number, string> = {
  [USER_STATUS.DISABLED]: '已禁用',
  [USER_STATUS.ENABLED]: '正常',
};

/** 用户角色 */
export const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

/** 用户角色文本映射 */
export const USER_ROLE_MAP: Record<string, string> = {
  [USER_ROLE.ADMIN]: '管理员',
  [USER_ROLE.USER]: '普通用户',
};
