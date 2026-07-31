/** 用户 */
export interface User {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  /** 角色：admin-管理员，user-普通用户 */
  role: string;
  status: number;
  createTime: string;
}
