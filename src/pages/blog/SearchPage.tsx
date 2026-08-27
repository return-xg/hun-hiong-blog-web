import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Pagination, Skeleton, Empty, Button } from 'antd';

import { searchArticles } from '@/api/search';
import type { ArticleSearchItem } from '@/types/search';
import SearchResultCard from './SearchResultCard';

const { Title, Text } = Typography;

/** 搜索每页条数 */
const SEARCH_PAGE_SIZE = 10;

const SearchPage: React.FC = () => {
  // ① 路由参数
  const [searchParams, setSearchParams] = useSearchParams();
  const urlKeyword = searchParams.get('keyword') ?? '';
  const urlPage = Number(searchParams.get('page')) || 1;

  // ② 状态声明
  const [results, setResults] = useState<ArticleSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(urlPage);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState(false);

  // ③ 请求序列号，用于防止竞态
  const requestIdRef = useRef(0);

  /** 执行搜索 */
  const executeSearch = useCallback(async (keyword: string, page: number) => {
    if (!keyword.trim()) return;

    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    setSearchError(false);

    try {
      const res = await searchArticles({ keyword: keyword.trim(), page, pageSize: SEARCH_PAGE_SIZE });
      if (currentRequestId !== requestIdRef.current) return;

      const data = (res as { data: { records: ArticleSearchItem[]; total: number; current: number } }).data;
      setResults(data.records);
      setTotal(data.total);
      setCurrent(data.current);
      setHasSearched(true);
    } catch {
      if (currentRequestId !== requestIdRef.current) return;
      setSearchError(true);
      setHasSearched(true);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  /** 更新 URL 参数（仅分页变化） */
  const updatePageParam = useCallback((keyword: string, page: number) => {
    const params = new URLSearchParams();
    if (keyword.trim()) {
      params.set('keyword', keyword.trim());
    }
    if (page > 1) {
      params.set('page', String(page));
    }
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  /** URL 变化时重新搜索（支持浏览器前进/后退） */
  useEffect(() => {
    if (urlKeyword) {
      executeSearch(urlKeyword, urlPage);
    } else {
      // 没有关键词时重置状态
      setResults([]);
      setTotal(0);
      setHasSearched(false);
      setSearchError(false);
    }
  }, [urlKeyword, urlPage, executeSearch]);

  /** 分页变化 */
  const handlePageChange = useCallback((page: number) => {
    if (!urlKeyword) return;
    updatePageParam(urlKeyword, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [urlKeyword, updatePageParam]);

  /** 重试搜索 */
  const handleRetry = useCallback(() => {
    if (urlKeyword) {
      executeSearch(urlKeyword, urlPage);
    }
  }, [urlKeyword, urlPage, executeSearch]);

  /** 渲染搜索结果区域 */
  const renderResults = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                padding: '24px 28px',
                borderRadius: 'var(--radius-card)',
                background: 'var(--bg-component)',
                border: '1px solid var(--border-light)',
              }}
            >
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      );
    }

    if (searchError) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Text type="danger" style={{ fontSize: 16 }}>搜索失败，请稍后重试</Text>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={handleRetry}>重新搜索</Button>
          </div>
        </div>
      );
    }

    if (hasSearched && results.length === 0) {
      return (
        <Empty
          description={
            <span style={{ color: 'var(--text-secondary)' }}>
              没有找到相关文章，换个关键词试试吧
            </span>
          }
          style={{ padding: '60px 0' }}
        />
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {results.map((article) => (
          <SearchResultCard key={article.id} article={article} keyword={urlKeyword} />
        ))}
      </div>
    );
  };

  // 没有关键词时显示引导状态
  if (!urlKeyword) {
    return (
      <div>
        <Title
          level={2}
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-color)',
            marginBottom: 24,
          }}
        >
          搜索文章
        </Title>
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
          <Text style={{ fontSize: 16 }}>请在上方搜索框中输入关键词开始搜索</Text>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 搜索结果统计 */}
      {hasSearched && !loading && !searchError && (
        <div style={{ marginBottom: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
          搜索“<Text strong>{urlKeyword}</Text>”共找到{' '}
          <Text strong style={{ color: 'var(--primary-color)' }}>{total}</Text> 篇文章
        </div>
      )}

      {/* 搜索结果 / 加载 / 空状态 / 错误 */}
      {renderResults()}

      {/* 分页 */}
      {hasSearched && !loading && !searchError && total > SEARCH_PAGE_SIZE && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Pagination
            current={current}
            total={total}
            pageSize={SEARCH_PAGE_SIZE}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
