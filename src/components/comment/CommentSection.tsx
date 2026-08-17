import React, { useEffect } from 'react';
import { Typography, Spin, message } from 'antd';
import { useAuthStore } from '@/store/useAuthStore';
import { useCommentStore } from '@/store/useCommentStore';
import { COMMENT_ROOT_PARENT_ID } from '@/utils/constants';
import type { CreateCommentRequest } from '@/types/comment';
import CommentItem from './CommentItem';
import CommentEditor from './CommentEditor';
import CommentEmpty from './CommentEmpty';

const { Title } = Typography;

interface CommentSectionProps {
  /** 文章 ID */
  articleId: number;
}

/** 评论区域入口 */
const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const { isAuthenticated } = useAuthStore();
  const { comments, loading, publishing, loadComments, createComment, setReplyComment } = useCommentStore();

  /** 进入文章时加载评论 */
  useEffect(() => {
    if (articleId) {
      loadComments(articleId);
    }
    // 离开时清理回复状态
    return () => {
      setReplyComment(null);
    };
  }, [articleId]);

  /** 发表一级评论 */
  const handleSubmitComment = async (content: string) => {
    if (!isAuthenticated) {
      message.warning('请登录后发表评论');
      return;
    }
    const data: CreateCommentRequest = {
      articleId,
      parentId: COMMENT_ROOT_PARENT_ID,
      content,
    };
    await createComment(data);
  };

  return (
    <div style={{ marginTop: 40 }}>
      <Title
        level={4}
        style={{
          fontFamily: 'var(--font-serif)',
          color: 'var(--text-color)',
          marginBottom: 24,
          fontWeight: 600,
        }}
      >
        评论区
      </Title>

      {/* 发表评论输入框（仅登录用户可见） */}
      {isAuthenticated ? (
        <CommentEditor loading={publishing} onSubmit={handleSubmitComment} />
      ) : (
        <div
          style={{
            padding: '16px 0',
            marginBottom: 24,
            textAlign: 'center',
            color: 'var(--text-light, #999)',
            fontSize: 14,
            borderBottom: '1px solid var(--border-light, #f0f0f0)',
          }}
        >
          请登录后发表评论
        </div>
      )}

      {/* 评论列表 */}
      <Spin spinning={loading}>
        {comments.length > 0 ? (
          <div>
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} articleId={articleId} />
            ))}
          </div>
        ) : (
          !loading && <CommentEmpty />
        )}
      </Spin>
    </div>
  );
};

export default CommentSection;
