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
