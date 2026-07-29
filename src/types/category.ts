/** 分类 */
export interface Category {
  id: number;
  name: string;
  slug?: string;
  sort?: number;
  description?: string;
  createTime: string;
}
