import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Tag, Divider, Spin, Space } from 'antd';
import { EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';

import { getArticleDetail } from '@/api/article';
import type { Article } from '@/types/article';
import { ARTICLE_STATUS_MAP } from '@/utils/constants';

const { Title, Text, Paragraph } = Typography;

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getArticleDetail(Number(id))
        .then((res) => {
          setArticle((res as any).data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!article) {
    return <Title level={4} style={{ textAlign: 'center', padding: 80 }}>文章不存在</Title>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      {/* 文章标题 */}
      <Title level={2} style={{ marginBottom: 8 }}>{article.title}</Title>

      {/* 文章元信息 */}
      <div style={{ marginBottom: 16, color: 'var(--text-secondary, #888)' }}>
        <Space size="middle" wrap>
          {article.categoryName && (
            <Text type="secondary">{article.categoryName}</Text>
          )}
          <Text type="secondary">
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {article.createTime}
          </Text>
          <Text type="secondary">
            <EyeOutlined style={{ marginRight: 4 }} />
            {article.viewCount} 阅读
          </Text>
          {article.status !== undefined && (
            <Tag color={article.status === 1 ? 'green' : 'default'}>
              {ARTICLE_STATUS_MAP[article.status] || '未知'}
            </Tag>
          )}
        </Space>
      </div>

      {/* 标签 */}
      {article.tags && article.tags.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {article.tags.map((tag) => (
            <Tag key={tag.id} style={{ marginBottom: 4 }}>
              {tag.name}
            </Tag>
          ))}
        </div>
      )}

      {/* 封面图 */}
      {article.coverUrl && (
        <div style={{ marginBottom: 24 }}>
          <img
            src={article.coverUrl}
            alt={article.title}
            style={{ width: '100%', borderRadius: 8 }}
          />
        </div>
      )}

      {/* 摘要 */}
      {article.summary && (
        <Paragraph
          type="secondary"
          style={{ marginBottom: 24, padding: '12px 16px', background: 'var(--bg-secondary, #f5f5f5)', borderRadius: 6, borderLeft: '4px solid var(--primary-color, #1677ff)' }}
        >
          {article.summary}
        </Paragraph>
      )}

      <Divider />

      {/* 文章正文（富文本 HTML） */}
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content || '' }}
      />
    </div>
  );
};

export default ArticleDetail;
