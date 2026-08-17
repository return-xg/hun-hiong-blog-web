/** 评论用户信息 */
export interface CommentUserInfo {
  userId: number;
  nickname: string;
  avatar: string;
}

/** 评论 */
export interface Comment {
  id: number;
  articleId: number;
  parentId: number;
  replyUserId?: number | null;
  replyUserNickname?: string | null;
  content: string;
  status: number;
  createTime: string;
  userInfo: CommentUserInfo;
  children: Comment[];
}

/** 发布评论请求 */
export interface CreateCommentRequest {
  articleId: number;
  parentId: number;
  replyUserId?: number | null;
  content: string;
}
