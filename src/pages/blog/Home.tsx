import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Tag, Spin, Pagination, Space, Empty } from 'antd';
import {
  ClockCircleOutlined,
  EyeOutlined,
  FolderOutlined,
} from '@ant-design/icons';

import { getArticleList } from '@/api/article';
import { getCategoryList } from '@/api/category';
import { getAllTags } from '@/api/tag';
import type { Article } from '@/types/article';
import type { Category } from '@/types/category';
import type { Tag as TagType } from '@/types/tag';
import { ARTICLE_STATUS, getFileUrl } from '@/utils/constants';
import { viewCountTracker } from '@/utils/storage';

const { Title, Text, Paragraph } = Typography;

/** 首页每页文章数 */
const HOME_PAGE_SIZE = 5;

const Home: React.FC = () => {
  // 文章列表
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  // 侧边栏数据
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);

  /** 加载已发布的文章列表 */
  useEffect(() => {
    setLoading(true);
    getArticleList({ current, size: HOME_PAGE_SIZE, status: ARTICLE_STATUS.PUBLISHED })
      .then((res) => {
        const data = (res as any).data;
        const records: Article[] = data.records;
        setArticles(viewCountTracker.mergeInto(records));
        setTotal(data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [current]);

  /** 加载侧边栏数据 */
  useEffect(() => {
    getCategoryList({ current: 1, size: 100 }).then((res) => {
      const data = (res as any).data;
      setCategories(data.records);
    });
    getAllTags().then((res) => {
      setTags((res as any).data);
    });
  }, []);

  /** 分页变化 */
  const handlePageChange = (page: number) => {
    setCurrent(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero 区域 — 清新渐变 + 装饰元素 */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          marginBottom: 48,
          padding: '56px 48px',
          background: 'var(--bg-hero)',
          minHeight: 220,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* 装饰圆 */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -20,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(91, 164, 164, 0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -30,
            right: 120,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(232, 131, 107, 0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '60%',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(91, 164, 164, 0.05)',
          }}
        />

        {/* 文字内容 */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontSize: 13,
              color: 'var(--primary-color)',
              fontWeight: 500,
              letterSpacing: 2,
              marginBottom: 12,
              textTransform: 'uppercase',
            }}
          >
            Welcome to my blog
          </div>
          <Title
            level={1}
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-color)',
              marginBottom: 12,
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            Hun Hiong Blog
          </Title>
          <Paragraph
            style={{
              color: 'var(--text-secondary)',
              fontSize: 16,
              marginBottom: 0,
              maxWidth: 480,
              lineHeight: 1.7,
            }}
          >
            记录技术与生活的点滴，在代码与文字之间寻找乐趣
          </Paragraph>
        </div>
      </div>

      {/* 主体区域：左侧文章列表 + 右侧侧边栏 */}
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
        {/* 左侧：文章列表 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 区域标题 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24,
            }}
          >
            <Title
              level={4}
              style={{
                margin: 0,
                fontFamily: 'var(--font-serif)',
                color: 'var(--text-color)',
              }}
            >
              最新文章
            </Title>
            <div
              style={{
                width: 40,
                height: 3,
                borderRadius: 2,
                background: 'var(--primary-color)',
              }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <Spin size="large" />
            </div>
          ) : articles.length === 0 ? (
            <Empty description="暂无文章" />
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
                      marginBottom: 20,
                      padding: '24px 28px',
                      borderRadius: 'var(--radius-card)',
                      background: 'var(--bg-component)',
                      border: '1px solid var(--border-light)',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      gap: 24,
                      alignItems: article.coverUrl ? 'center' : 'stretch',
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
                    {/* 文字内容 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* 标题 */}
                      <Title
                        level={4}
                        style={{
                          marginBottom: 10,
                          fontFamily: 'var(--font-serif)',
                          color: 'var(--text-color)',
                          lineHeight: 1.4,
                        }}
                      >
                        {article.title}
                      </Title>

                      {/* 元信息行 */}
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

                      {/* 标签 */}
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

                      {/* 摘要 */}
                      {article.summary && (
                        <Paragraph
                          style={{
                            color: 'var(--text-secondary)',
                            marginBottom: 0,
                            fontSize: 14,
                            lineHeight: 1.7,
                          }}
                          ellipsis={{ rows: 2 }}
                        >
                          {article.summary}
                        </Paragraph>
                      )}
                    </div>

                    {/* 封面图 */}
                    {article.coverUrl && (
                      <div
                        style={{
                          flexShrink: 0,
                          width: 180,
                          height: 130,
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={getFileUrl(article.coverUrl)}
                          alt={article.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </article>
                </Link>
              ))}

              {/* 分页 */}
              {total > HOME_PAGE_SIZE && (
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                  <Pagination
                    current={current}
                    total={total}
                    pageSize={HOME_PAGE_SIZE}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* 右侧：侧边栏 */}
        <div style={{ width: 260, flexShrink: 0 }}>
          {/* 博主卡片 */}
          <div
            style={{
              marginBottom: 24,
              padding: '28px 24px',
              background: 'var(--bg-component)',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: 24,
                color: 'var(--primary-color)',
              }}
            >
              ✦
            </div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--text-color)',
                marginBottom: 6,
              }}
            >
              Hun Hiong
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              记录技术与生活的点滴
            </div>
          </div>

          {/* 分类 */}
          <div
            style={{
              marginBottom: 24,
              padding: '20px 24px',
              background: 'var(--bg-component)',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'var(--font-serif)',
                color: 'var(--text-color)',
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              分类
            </div>
            {categories.length === 0 ? (
              <Text style={{ color: 'var(--text-light)', fontSize: 13 }}>暂无分类</Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    style={{
                      color: 'var(--text-secondary)',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'all 0.2s',
                      fontSize: 14,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = 'var(--primary-color)';
                      el.style.background = 'var(--primary-light)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = 'var(--text-secondary)';
                      el.style.background = 'transparent';
                    }}
                  >
                    <Space size={8}>
                      <FolderOutlined style={{ fontSize: 13 }} />
                      <span>{cat.name}</span>
                    </Space>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 标签云 */}
          <div
            style={{
              padding: '20px 24px',
              background: 'var(--bg-component)',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'var(--font-serif)',
                color: 'var(--text-color)',
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              标签
            </div>
            {tags.length === 0 ? (
              <Text style={{ color: 'var(--text-light)', fontSize: 13 }}>暂无标签</Text>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {tags.map((tag) => (
                  <Link key={tag.id} to={`/tag/${tag.id}`}>
                    <Tag
                      style={{
                        cursor: 'pointer',
                        marginBottom: 0,
                        background: 'var(--tag-bg)',
                        color: 'var(--tag-text)',
                        border: 'none',
                        borderRadius: 'var(--radius-tag)',
                        fontSize: 12,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = 'var(--primary-color)';
                        el.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = 'var(--tag-bg)';
                        el.style.color = 'var(--tag-text)';
                      }}
                    >
                      {tag.name}
                    </Tag>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
