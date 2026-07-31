import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Tag, Spin, Pagination, Empty } from 'antd';
import { ClockCircleOutlined, EyeOutlined, FolderOutlined } from '@ant-design/icons';

import { getArticleList } from '@/api/article';
import { getCategoryDetail } from '@/api/category';
import type { Article } from '@/types/article';
import type { Category } from '@/types/category';
import { ARTICLE_STATUS } from '@/utils/constants';
import { viewCountTracker } from '@/utils/storage';

const { Title, Text, Paragraph } = Typography;

/** 分类页每页文章数 */
const PAGE_SIZE = 10;

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!id) return;
    getCategoryDetail(id)
      .then((res) => {
        setCategoryInfo((res as any).data);
      })
      .catch(() => {
        // 分类不存在时保持 null
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getArticleList({ current, size: PAGE_SIZE, categoryId: id, status: ARTICLE_STATUS.PUBLISHED })
      .then((res) => {
        const data = (res as any).data;
        const records: Article[] = data.records;
        setArticles(viewCountTracker.mergeInto(records));
        setTotal(data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, current]);

  const handlePageChange = (page: number) => {
    setCurrent(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      {/* 分类标题区 */}
      <div
        style={{
          marginBottom: 36,
          padding: '28px 32px',
          background: 'var(--bg-hero)',
          borderRadius: 'var(--radius-card)',
        }}
      >
        <Title
          level={3}
          style={{
            marginBottom: 8,
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-color)',
          }}
        >
          <FolderOutlined style={{ marginRight: 10, color: 'var(--primary-color)' }} />
          {categoryInfo ? categoryInfo.name : '...'}
        </Title>
        {categoryInfo?.description && (
          <Paragraph style={{ color: 'var(--text-secondary)', marginBottom: 4, fontSize: 14 }}>
            {categoryInfo.description}
          </Paragraph>
        )}
        <Text style={{ color: 'var(--text-light)', fontSize: 13 }}>共 {total} 篇文章</Text>
      </div>

      {/* 文章列表 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Spin size="large" />
        </div>
      ) : articles.length === 0 ? (
        <Empty description="该分类下暂无文章" />
      ) : (
        <>
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <article
                style={{
                  marginBottom: 16,
                  padding: '20px 24px',
                  background: 'var(--bg-component)',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                }}
              >
                <Title
                  level={4}
                  style={{
                    marginBottom: 10,
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--text-color)',
                  }}
                >
                  {article.title}
                </Title>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 10,
                    fontSize: 13,
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
                    {article.viewCount}
                  </span>
                </div>

                {article.tags && article.tags.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    {article.tags.slice(0, 4).map((tag) => (
                      <Tag
                        key={tag.id}
                        style={{
                          marginBottom: 4,
                          background: 'var(--tag-bg)',
                          color: 'var(--tag-text)',
                          border: 'none',
                          borderRadius: 'var(--radius-tag)',
                          fontSize: 12,
                        }}
                      >
                        {tag.name}
                      </Tag>
                    ))}
                  </div>
                )}

                {article.summary && (
                  <Paragraph
                    style={{ color: 'var(--text-secondary)', marginBottom: 0, fontSize: 14, lineHeight: 1.7 }}
                    ellipsis={{ rows: 2 }}
                  >
                    {article.summary}
                  </Paragraph>
                )}
              </article>
            </Link>
          ))}

          {total > PAGE_SIZE && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
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

export default CategoryPage;
