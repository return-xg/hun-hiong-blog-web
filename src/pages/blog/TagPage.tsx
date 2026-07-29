import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Tag, Spin, Pagination, Space, Empty } from 'antd';
import { ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';

import { getArticleList } from '@/api/article';
import { getAllTags } from '@/api/tag';
import type { Article } from '@/types/article';
import type { Tag as TagType } from '@/types/tag';

const { Title, Text, Paragraph } = Typography;

/** 每页文章数 */
const PAGE_SIZE = 10;

const TagPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [tagInfo, setTagInfo] = useState<TagType | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  /** 加载标签信息 */
  useEffect(() => {
    if (!id) return;
    getAllTags().then((res) => {
      const tagList = (res as any).data as TagType[];
      const found = tagList.find((t) => String(t.id) === id);
      if (found) setTagInfo(found);
    });
  }, [id]);

  /** 加载该标签下的文章列表 */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getArticleList({ current, size: PAGE_SIZE, tagId: Number(id) })
      .then((res) => {
        const data = (res as any).data;
        setArticles(data.records);
        setTotal(data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, current]);

  /** 分页变化 */
  const handlePageChange = (page: number) => {
    setCurrent(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* 标签标题区 */}
      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          标签：{tagInfo ? tagInfo.name : '...'}
        </Title>
        {tagInfo?.slug && (
          <Text type="secondary">别名：{tagInfo.slug}</Text>
        )}
        <div style={{ marginTop: 8 }}>
          <Text type="secondary">共 {total} 篇文章</Text>
        </div>
      </div>

      {/* 文章列表 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Spin size="large" />
        </div>
      ) : articles.length === 0 ? (
        <Empty description="该标签下暂无文章" />
      ) : (
        <>
          {articles.map((article) => (
            <article
              key={article.id}
              style={{
                marginBottom: 24,
                padding: '20px 24px',
                background: 'var(--bg-component, #fff)',
                borderRadius: 8,
                border: '1px solid var(--border-color, #f0f0f0)',
              }}
            >
              {/* 标题 */}
              <Title level={4} style={{ marginBottom: 8 }}>
                <Link to={`/article/${article.id}`} style={{ color: 'inherit' }}>
                  {article.title}
                </Link>
              </Title>

              {/* 元信息 */}
              <div style={{ marginBottom: 12, color: 'var(--text-secondary, #888)' }}>
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
                </Space>
              </div>

              {/* 标签 */}
              {article.tags && article.tags.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  {article.tags.map((tag) => (
                    <Link key={tag.id} to={`/tag/${tag.id}`}>
                      <Tag
                        color={String(tag.id) === id ? 'blue' : 'default'}
                        style={{ marginBottom: 4, cursor: 'pointer' }}
                      >
                        {tag.name}
                      </Tag>
                    </Link>
                  ))}
                </div>
              )}

              {/* 摘要 */}
              {article.summary && (
                <Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                  style={{ marginBottom: 0 }}
                >
                  {article.summary}
                </Paragraph>
              )}
            </article>
          ))}

          {/* 分页 */}
          {total > PAGE_SIZE && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Pagination
                current={current}
                total={total}
                pageSize={PAGE_SIZE}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TagPage;
