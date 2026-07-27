/** 统一响应格式 */
export interface Result<T> {
  code: number;
  message: string;
  data: T;
}

/** 分页响应格式 */
export interface PageResult<T> {
  current: number;
  size: number;
  total: number;
  pages: number;
  records: T[];
}
