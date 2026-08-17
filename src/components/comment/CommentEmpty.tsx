import React from 'react';
import { Empty } from 'antd';

/** 评论空状态 */
const CommentEmpty: React.FC = () => {
  return (
    <Empty
      description="还没有评论，快来抢沙发吧~"
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      style={{ padding: '24px 0' }}
    />
  );
};

export default CommentEmpty;
