import { create } from 'zustand';
import { message } from 'antd';
import { getArticleComments, createComment, deleteComment } from '@/api/comment';
import type { Comment, CreateCommentRequest } from '@/types/comment';

interface CommentState {
  comments: Comment[];
  loading: boolean;
  publishing: boolean;
  replyComment: Comment | null;
  loadComments: (articleId: number) => Promise<void>;
  createComment: (data: CreateCommentRequest) => Promise<boolean>;
  removeComment: (id: number, articleId: number) => Promise<void>;
  setReplyComment: (comment: Comment | null) => void;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: [],
  loading: false,
  publishing: false,
  replyComment: null,

  loadComments: async (articleId: number) => {
    set({ loading: true });
    try {
      const result = await getArticleComments(articleId);
      if (result.code === 0) {
        set({ comments: result.data });
      }
    } finally {
      set({ loading: false });
    }
  },

  createComment: async (data: CreateCommentRequest) => {
    set({ publishing: true });
    try {
      const result = await createComment(data);
      if (result.code === 0) {
        message.success('评论发布成功');
        // 发布成功后重新加载评论列表
        await get().loadComments(data.articleId);
        set({ replyComment: null });
        return true;
      }
      return false;
    } catch {
      // 错误消息由请求拦截器统一处理
      return false;
    } finally {
      set({ publishing: false });
    }
  },

  removeComment: async (id: number, articleId: number) => {
    try {
      const result = await deleteComment(id);
      if (result.code === 0) {
        message.success('删除成功');
        await get().loadComments(articleId);
      }
    } catch {
      // 错误消息由请求拦截器统一处理
    }
  },

  setReplyComment: (comment: Comment | null) => {
    set({ replyComment: comment });
  },
}));
