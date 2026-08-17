import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { COMMENT_MAX_LENGTH } from '@/utils/constants';

const { TextArea } = Input;

interface CommentEditorProps {
  /** 提交按钮 loading 状态 */
  loading?: boolean;
  /** 提交回调 */
  onSubmit: (content: string) => void;
}

/** 发表评论输入框 */
const CommentEditor: React.FC<CommentEditorProps> = ({ loading, onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) {
      message.warning('评论内容不能为空');
      return;
    }
    if (trimmed.length > COMMENT_MAX_LENGTH) {
      message.warning(`评论内容不能超过 ${COMMENT_MAX_LENGTH} 字`);
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <TextArea
        rows={4}
        placeholder="请输入评论内容..."
        maxLength={COMMENT_MAX_LENGTH}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        showCount
        style={{ marginBottom: 12 }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          loading={loading}
          disabled={!content.trim()}
          onClick={handleSubmit}
        >
          发表评论
        </Button>
      </div>
    </div>
  );
};

export default CommentEditor;
