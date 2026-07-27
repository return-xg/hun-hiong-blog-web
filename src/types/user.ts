/** 用户 */
export interface User {
  id: number;
  username: string;
  email?: string;
  avatar?: string;
  role: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}
