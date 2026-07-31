import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Tag, Divider, Spin } from 'antd';
import { EyeOutlined, ClockCircleOutlined, FolderOutlined } from '@ant-design/icons';

import { getArticleDetail, incrementArticleView } from '@/api/article';
import type { Article } from '@/types/article';
import { ARTICLE_STATUS_MAP, getFileUrl } from '@/utils/constants';
import { viewCountTracker } from '@/utils/storage';

const { Title, Paragraph } = Typography;

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getArticleDetail(id)
      .then((res) => {
        const articleData = (res as any).data as Article;
        const [merged] = viewCountTracker.mergeInto([articleData]);
        setArticle(merged);

        incrementArticleView(id).then(() => {
          const dbViewCount = articleData.viewCount ?? 0;
          viewCountTracker.recordIncrement(id, dbViewCount);
          const [updated] = viewCountTracker.mergeInto([articleData]);
          setArticle(updated);
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!article) {
    return (
      <Title level={4} style={{ textAlign: 'center', padding: 80, fontFamily: 'var(--font-serif)' }}>
        文章不存在
      </Title>
    );
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '16px 0' }}>
      {/* 文章头部 */}
      <div style={{ marginBottom: 32 }}>
        {/* 标签 */}
        {article.tags && article.tags.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {article.tags.map((tag) => (
              <Tag
                key={tag.id}
                style={{
                  marginBottom: 4,
                  background: 'var(--tag-bg)',
                  color: 'var(--tag-text)',
                  border: 'none',
                  borderRadius: 'var(--radius-tag)',
                }}
              >
                {tag.name}
              </Tag>
            ))}
          </div>
        )}

        {/* 标题 */}
        <Title
          level={1}
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-color)',
            marginBottom: 16,
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          {article.title}
        </Title>

        {/* 元信息 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            fontSize: 14,
            color: 'var(--text-light)',
          }}
        >
          {article.categoryName && (
            <span>
              <FolderOutlined style={{ marginRight: 4 }} />
              {article.categoryName}
            </span>
          )}
          <span>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {article.createTime}
          </span>
          <span>
            <EyeOutlined style={{ marginRight: 4 }} />
            {article.viewCount} 阅读
          </span>
          {article.status !== undefined && (
            <Tag
              color={article.status === 1 ? 'cyan' : 'default'}
              style={{ borderRadius: 'var(--radius-tag)' }}
            >
              {ARTICLE_STATUS_MAP[article.status] || '未知'}
            </Tag>
          )}
        </div>
      </div>

      {/* 封面图 */}
      {article.coverUrl && (
        <div
          style={{
            marginBottom: 32,
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
          }}
        >
          <img
            src={getFileUrl(article.coverUrl)}
            alt={article.title}
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      )}

      {/* 摘要 */}
      {article.summary && (
        <div
          style={{
            marginBottom: 32,
            padding: '16px 24px',
            background: 'var(--primary-light)',
            borderRadius: 'var(--radius-card)',
            borderLeft: '3px solid var(--primary-color)',
          }}
        >
          <Paragraph
            style={{
              color: 'var(--text-secondary)',
              marginBottom: 0,
              fontSize: 15,
              lineHeight: 1.8,
              fontStyle: 'italic',
            }}
          >
            {article.summary}
          </Paragraph>
        </div>
      )}

      <Divider style={{ borderColor: 'var(--border-light)', margin: '24px 0' }} />

      {/* 文章正文 */}
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content || '' }}
      />
    </div>
  );
};

export default ArticleDetail;
