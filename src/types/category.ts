/** 分类 */
export interface Category {
  id: string;
  name: string;
  slug?: string;
  sort?: number;
  description?: string;
  createTime: string;
}
