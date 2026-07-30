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
import { ARTICLE_STATUS } from '@/utils/constants';
import heroImage from '@/assets/hero.png';

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
        setArticles(data.records);
        setTotal(data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [current]);

  /** 加载侧边栏数据（分类 + 标签） */
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
      {/* Hero 横幅 */}
      <div
        style={{
          position: 'relative',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 40,
          height: 320,
        }}
      >
        <img
          src={heroImage}
          alt="Hero"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '32px 40px',
          }}
        >
          <Title level={2} style={{ color: '#fff', marginBottom: 4 }}>
            Hun Hiong Blog
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
            记录技术与生活的点滴
          </Text>
        </div>
      </div>

      {/* 主体区域：左侧文章列表 + 右侧侧边栏 */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        {/* 左侧：文章列表 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title level={4} style={{ marginBottom: 20 }}>最新文章</Title>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <Spin size="large" />
            </div>
          ) : articles.length === 0 ? (
            <Empty description="暂无文章" />
          ) : (
            <>
              {articles.map((article) => (
                <article
                  key={article.id}
                  style={{
                    marginBottom: 24,
                    borderRadius: 8,
                    border: '1px solid var(--border-color, #e8e8e8)',
                    background: 'var(--bg-component, #fff)',
                    overflow: 'hidden',
                    display: 'flex',
                  }}
                >
                  {/* 封面图 */}
                  {article.coverUrl && (
                    <Link
                      to={`/article/${article.id}`}
                      style={{ flexShrink: 0, width: 200, height: 160 }}
                    >
                      <img
                        src={article.coverUrl}
                        alt={article.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Link>
                  )}

                  {/* 内容区 */}
                  <div style={{ flex: 1, padding: '16px 20px', minWidth: 0 }}>
                    <Title level={4} style={{ marginBottom: 8 }}>
                      <Link to={`/article/${article.id}`} style={{ color: 'inherit' }}>
                        {article.title}
                      </Link>
                    </Title>

                    {/* 元信息 */}
                    <div style={{ marginBottom: 8, color: 'var(--text-secondary, #888)' }}>
                      <Space size="middle" wrap>
                        {article.categoryName && (
                          <Text type="secondary">
                            <FolderOutlined style={{ marginRight: 4 }} />
                            {article.categoryName}
                          </Text>
                        )}
                        <Text type="secondary">
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          {article.createTime}
                        </Text>
                        <Text type="secondary">
                          <EyeOutlined style={{ marginRight: 4 }} />
                          {article.viewCount}
                        </Text>
                      </Space>
                    </div>

                    {/* 标签 */}
                    {article.tags && article.tags.length > 0 && (
                      <div style={{ marginBottom: 8 }}>
                        {article.tags.map((tag) => (
                          <Link key={tag.id} to={`/tag/${tag.id}`}>
                            <Tag style={{ marginBottom: 4, cursor: 'pointer' }}>
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
                  </div>
                </article>
              ))}

              {/* 分页 */}
              {total > HOME_PAGE_SIZE && (
                <div style={{ textAlign: 'center', marginTop: 32 }}>
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
        <div style={{ width: 240, flexShrink: 0 }}>
          {/* 分类 */}
          <div
            style={{
              marginBottom: 24,
              padding: '16px 20px',
              background: 'var(--bg-component, #fff)',
              borderRadius: 8,
              border: '1px solid var(--border-color, #e8e8e8)',
            }}
          >
            <Title level={5} style={{ marginBottom: 12 }}>分类</Title>
            {categories.length === 0 ? (
              <Text type="secondary">暂无分类</Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {categories.map((cat) => (
                  <Link key={cat.id} to={`/category/${cat.id}`} style={{ color: 'var(--text-color, #333)' }}>
                    <Space>
                      <FolderOutlined />
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
              padding: '16px 20px',
              background: 'var(--bg-component, #fff)',
              borderRadius: 8,
              border: '1px solid var(--border-color, #e8e8e8)',
            }}
          >
            <Title level={5} style={{ marginBottom: 12 }}>标签</Title>
            {tags.length === 0 ? (
              <Text type="secondary">暂无标签</Text>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {tags.map((tag) => (
                  <Link key={tag.id} to={`/tag/${tag.id}`}>
                    <Tag style={{ cursor: 'pointer', marginBottom: 0 }}>{tag.name}</Tag>
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
