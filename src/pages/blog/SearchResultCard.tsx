import { Link } from 'react-router-dom';
import { Typography, Tag } from 'antd';
import { ClockCircleOutlined, EyeOutlined, FolderOutlined } from '@ant-design/icons';

import type { ArticleSearchItem } from '@/types/search';
import { getFileUrl } from '@/utils/constants';
import HighlightText from '@/components/search/HighlightText';

const { Title, Paragraph } = Typography;

interface SearchResultCardProps {
  article: ArticleSearchItem;
  /** 搜索关键词，用于高亮 */
  keyword: string;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ article, keyword }) => {
  return (
    <Link
      to={`/article/${article.id}`}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <article
        style={{
          padding: '24px 28px',
          borderRadius: 'var(--radius-card)',
          background: 'var(--bg-component)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          gap: 24,
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
            <HighlightText text={article.title} keyword={keyword} />
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
              flexWrap: 'wrap',
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
              {article.createTime.slice(0, 10)}
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
                  {tag.name && keyword ? (
                    <HighlightText text={tag.name} keyword={keyword} />
                  ) : (
                    tag.name
                  )}
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
              <HighlightText text={article.summary} keyword={keyword} />
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
  );
};

export default SearchResultCard;
