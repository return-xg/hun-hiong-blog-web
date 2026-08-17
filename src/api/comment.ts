import request from './request';
import type { Result } from '@/types/api';
import type { Comment, CreateCommentRequest } from '@/types/comment';

/** 获取文章评论列表 */
export function getArticleComments(articleId: number): Promise<Result<Comment[]>> {
  return request.get(`/comment/article/${articleId}`);
}

/** 发布评论 */
export function createComment(data: CreateCommentRequest): Promise<Result<Comment>> {
  return request.post('/comment', data);
}

/** 删除评论 */
export function deleteComment(id: number): Promise<Result<void>> {
  return request.delete(`/comment/${id}`);
}
