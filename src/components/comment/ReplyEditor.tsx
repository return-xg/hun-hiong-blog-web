import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { COMMENT_MAX_LENGTH } from '@/utils/constants';
import type { Comment } from '@/types/comment';

const { TextArea } = Input;

interface ReplyEditorProps {
  /** 被回复的评论 */
  replyComment: Comment;
  /** 提交按钮 loading 状态 */
  loading?: boolean;
  /** 提交回调 */
  onSubmit: (content: string) => void;
  /** 取消回复 */
  onCancel: () => void;
}

/** 回复评论输入框 */
const ReplyEditor: React.FC<ReplyEditorProps> = ({ replyComment, loading, onSubmit, onCancel }) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) {
      message.warning('回复内容不能为空');
      return;
    }
    if (trimmed.length > COMMENT_MAX_LENGTH) {
      message.warning(`回复内容不能超过 ${COMMENT_MAX_LENGTH} 字`);
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <div
      style={{
        marginTop: 12,
        padding: 16,
        background: 'var(--bg-component, #fafafa)',
        borderRadius: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
          fontSize: 14,
          color: 'var(--text-secondary, #666)',
        }}
      >
        <span>
          正在回复：<span style={{ color: 'var(--primary-color, #1677ff)' }}>@{replyComment.userInfo.nickname}</span>
        </span>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={onCancel}
        />
      </div>
      <TextArea
        rows={3}
        placeholder="请输入回复内容..."
        maxLength={COMMENT_MAX_LENGTH}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        showCount
        style={{ marginBottom: 12 }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button size="small" onClick={onCancel}>
          取消
        </Button>
        <Button
          size="small"
          type="primary"
          loading={loading}
          disabled={!content.trim()}
          onClick={handleSubmit}
        >
          回复
        </Button>
      </div>
    </div>
  );
};

export default ReplyEditor;
