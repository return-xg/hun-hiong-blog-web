import React from 'react';
import { Button, Modal, Avatar } from 'antd';
import { DeleteOutlined, MessageOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/useAuthStore';
import { useCommentStore } from '@/store/useCommentStore';
import { getFileUrl, USER_ROLE } from '@/utils/constants';
import type { Comment } from '@/types/comment';
import ReplyEditor from './ReplyEditor';

interface CommentItemProps {
  /** 评论数据 */
  comment: Comment;
  /** 所属文章 ID */
  articleId: number;
  /** 是否为子评论（递归场景） */
  isChild?: boolean;
}

/** 单条评论组件，支持递归展示子评论 */
const CommentItem: React.FC<CommentItemProps> = ({ comment, articleId, isChild = false }) => {
  const { user } = useAuthStore();
  const { replyComment, setReplyComment, publishing, createComment, removeComment } = useCommentStore();

  /** 是否可以删除：评论作者本人或管理员 */
  const canDelete = user && (
    user.id === comment.userInfo.userId || user.role === USER_ROLE.ADMIN
  );

  /** 是否正在回复该评论 */
  const isReplying = replyComment?.id === comment.id;

  /** 处理回复提交 */
  const handleReplySubmit = async (content: string) => {
    await createComment({
      articleId,
      parentId: comment.id,
      replyUserId: comment.userInfo.userId,
      content,
    });
  };

  /** 处理删除 */
  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除该评论吗？',
      content: '删除后不可恢复',
      okText: '确认',
      cancelText: '取消',
      onOk: () => removeComment(comment.id, articleId),
    });
  };

  /** 切换回复状态 */
  const handleToggleReply = () => {
    if (isReplying) {
      setReplyComment(null);
    } else {
      setReplyComment(comment);
    }
  };

  const avatarUrl = getFileUrl(comment.userInfo.avatar);

  return (
    <div
      style={{
        padding: isChild ? '12px 0' : '16px 0',
        borderBottom: isChild ? 'none' : '1px solid var(--border-light, #f0f0f0)',
      }}
    >
      {/* 评论主体 */}
      <div style={{ display: 'flex', gap: 12 }}>
        {/* 头像 */}
        <Avatar
          src={avatarUrl}
          size={isChild ? 32 : 40}
          style={{ flexShrink: 0, backgroundColor: 'var(--primary-color, #1677ff)' }}
        >
          {comment.userInfo.nickname?.charAt(0)}
        </Avatar>

        {/* 内容区域 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 用户信息行 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontWeight: 500,
                fontSize: isChild ? 13 : 14,
                color: 'var(--text-color, #333)',
              }}
            >
              {comment.userInfo.nickname}
            </span>
            {comment.replyUserNickname && (
              <span style={{ fontSize: 13, color: 'var(--text-light, #999)' }}>
                回复 <span style={{ color: 'var(--primary-color, #1677ff)' }}>@{comment.replyUserNickname}</span>
              </span>
            )}
            <span style={{ fontSize: 12, color: 'var(--text-light, #999)' }}>
              {comment.createTime}
            </span>
          </div>

          {/* 评论内容 */}
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: 'var(--text-color, #333)',
              wordBreak: 'break-word',
              marginBottom: 8,
            }}
          >
            {comment.content}
          </div>

          {/* 操作按钮 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {!isChild && (
              <Button
                type="text"
                size="small"
                icon={<MessageOutlined />}
                onClick={handleToggleReply}
                style={{ fontSize: 13, color: 'var(--text-light, #999)', padding: '0 4px' }}
              >
                回复
              </Button>
            )}
            {canDelete && (
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                style={{ fontSize: 13, padding: '0 4px' }}
              >
                删除
              </Button>
            )}
          </div>

          {/* 回复编辑器 */}
          {isReplying && (
            <ReplyEditor
              replyComment={comment}
              loading={publishing}
              onSubmit={handleReplySubmit}
              onCancel={() => setReplyComment(null)}
            />
          )}

          {/* 子评论递归渲染 */}
          {comment.children && comment.children.length > 0 && (
            <div
              style={{
                marginTop: 8,
                paddingLeft: 16,
                borderLeft: '2px solid var(--border-light, #f0f0f0)',
              }}
            >
              {comment.children.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  articleId={articleId}
                  isChild
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
