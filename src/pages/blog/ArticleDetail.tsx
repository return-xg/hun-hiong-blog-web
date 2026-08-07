import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Tag, Divider, Spin } from 'antd';
import { EyeOutlined, ClockCircleOutlined, FolderOutlined, SwapOutlined } from '@ant-design/icons';

import { getArticleList, getArticleDetail, incrementArticleView } from '@/api/article';
import type { Article } from '@/types/article';
import { ARTICLE_STATUS, ARTICLE_STATUS_MAP, getFileUrl } from '@/utils/constants';
import { viewCountTracker } from '@/utils/storage';

const { Title, Paragraph, Text } = Typography;

/** 推荐文章数量 */
const RECOMMEND_COUNT = 3;

/** 从数组中随机抽取指定数量的元素 */
function pickRandom<T>(items: T[], count: number): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendArticles, setRecommendArticles] = useState<Article[]>([]);

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

  /** 加载推荐文章：优先同分类，不足时用其他文章补齐 */
  const loadRecommendArticles = (currentArticle: Article) => {
    const categoryId = currentArticle.categoryId;

    // 先获取同分类下的文章
    const sameCategoryPromise = categoryId
      ? getArticleList({ current: 1, size: 50, categoryId, status: ARTICLE_STATUS.PUBLISHED })
      : Promise.resolve(null);

    Promise.all([
      sameCategoryPromise,
      getArticleList({ current: 1, size: 50, status: ARTICLE_STATUS.PUBLISHED }),
    ])
      .then(([sameCatRes, allRes]) => {
        const sameCatRecords = ((sameCatRes as any)?.data?.records ?? []) as Article[];
        const allRecords = ((allRes as any)?.data?.records ?? []) as Article[];

        // 排除当前文章
        const sameCatCandidates = sameCatRecords.filter((a) => String(a.id) !== id);
        const otherCandidates = allRecords.filter(
          (a) => String(a.id) !== id && String(a.categoryId) !== String(categoryId),
        );

        // 优先从同分类中抽取，不足的部分用其他文章补齐
        const sameCatPicked = pickRandom(sameCatCandidates, RECOMMEND_COUNT);
        const remaining = RECOMMEND_COUNT - sameCatPicked.length;
        const otherPicked = remaining > 0 ? pickRandom(otherCandidates, remaining) : [];

        setRecommendArticles(viewCountTracker.mergeInto([...sameCatPicked, ...otherPicked]));
      })
      .catch(() => {
        // 推荐文章加载失败不影响页面展示
      });
  };

  /** 文章加载完成后加载推荐 */
  useEffect(() => {
    if (article) {
      loadRecommendArticles(article);
    }
  }, [article?.id]);

  /** 换一批推荐 */
  const handleRefreshRecommend = () => {
    if (article) {
      loadRecommendArticles(article);
    }
  };

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

      {/* 推荐阅读 — 轻量链接列表，与首页卡片布局区分 */}
      {recommendArticles.length > 0 && (
        <>
          <Divider style={{ borderColor: 'var(--border-light)', margin: '40px 0 20px' }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <Title
              level={5}
              style={{
                margin: 0,
                fontFamily: 'var(--font-serif)',
                color: 'var(--text-secondary)',
                fontWeight: 500,
              }}
            >
              推荐阅读
            </Title>
            <Text
              style={{
                fontSize: 12,
                color: 'var(--primary-color)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
              onClick={handleRefreshRecommend}
            >
              <SwapOutlined /> 换一批
            </Text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recommendArticles.map((item, index) => (
              <Link
                key={item.id}
                to={`/article/${item.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                  borderBottom: index < recommendArticles.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-component)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    color: 'var(--text-color)',
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                  ellipsis
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    flexShrink: 0,
                    color: 'var(--text-light)',
                    fontSize: 12,
                  }}
                >
                  {item.createTime}
                </Text>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleDetail;
