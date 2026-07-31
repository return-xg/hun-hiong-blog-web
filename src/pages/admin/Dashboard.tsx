import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Table, Tag, Spin, Space } from 'antd';
import {
  FileTextOutlined,
  FolderOutlined,
  TagsOutlined,
  EyeOutlined,
  LikeOutlined,
  PieChartOutlined,
  FireOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

import { getDashboardOverview, getCategoryDistribution, getTopArticles, getRecentArticles } from '@/api/dashboard';
import type { DashboardOverview, CategoryDistribution, TopArticle, RecentArticle } from '@/types/dashboard';

const { Title, Text } = Typography;

/** 统计卡片配置 */
const STAT_CARDS = [
  { key: 'articleCount', label: '文章总数', icon: <FileTextOutlined />, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { key: 'categoryCount', label: '分类总数', icon: <FolderOutlined />, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { key: 'tagCount', label: '标签总数', icon: <TagsOutlined />, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { key: 'viewCount', label: '总浏览量', icon: <EyeOutlined />, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { key: 'likeCount', label: '总点赞数', icon: <LikeOutlined />, gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
] as const;

/** 饼图配色 */
const PIE_COLORS = ['#667eea', '#f5576c', '#00f2fe', '#43e97b', '#fa709a', '#fee140', '#764ba2', '#4facfe'];

/** 格式化数字：超过 1000 显示 x.xk */
const formatNumber = (num: number): string => {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}w`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
};

const Dashboard: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryDistribution[]>([]);
  const [topArticles, setTopArticles] = useState<TopArticle[]>([]);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [loading, setLoading] = useState(true);

  /** 加载所有仪表盘数据 */
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getDashboardOverview(),
      getCategoryDistribution(),
      getTopArticles(),
      getRecentArticles(),
    ])
      .then(([overviewRes, categoryRes, topRes, articlesRes]) => {
        setOverview((overviewRes as any).data);
        setCategoryData((categoryRes as any).data);
        setTopArticles((topRes as any).data);
        setRecentArticles((articlesRes as any).data);
      })
      .finally(() => setLoading(false));
  }, []);

  /** 最近文章表格列 */
  const columns: ColumnsType<RecentArticle> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text: string, record) => (
        <Link to={`/article/${record.id}`} style={{ color: 'var(--text-color, #333)' }}>
          {text}
        </Link>
      ),
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 120,
      render: (_: string, record: RecentArticle) => {
        const name = record.categoryName || record.category_name;
        return name ? <Tag>{name}</Tag> : '-';
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 180,
      render: (tags: RecentArticle['tags']) =>
        tags && tags.length > 0
          ? tags.map((tag) => <Tag key={tag.id}>{tag.name}</Tag>)
          : '-',
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      align: 'center',
      render: (val: number) => (
        <Space size={4}>
          <EyeOutlined style={{ color: 'var(--text-secondary, #888)' }} />
          {formatNumber(val)}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (_: string, record: RecentArticle) => record.createTime || record.create_time || '-',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 120 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>仪表盘</Title>

      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        {STAT_CARDS.map((card) => {
          const value = overview ? (overview as unknown as Record<string, number>)[card.key] ?? 0 : 0;
          return (
            <div
              key={card.key}
              style={{
                background: card.gradient,
                borderRadius: 12,
                padding: '24px 20px',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* 背景装饰圆 */}
              <div style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: -30,
                right: 20,
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
              }} />
              <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.9 }}>
                {card.icon}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
                {formatNumber(value)}
              </div>
              <div style={{ fontSize: 14, opacity: 0.85 }}>
                {card.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* 图表区域：分类分布 + 热门文章 Top5 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* 分类文章分布（饼图） */}
        <Card
          title={
            <Space>
              <PieChartOutlined style={{ color: '#667eea' }} />
              <span>分类文章分布</span>
            </Space>
          }
          style={{ borderRadius: 12 }}
          styles={{ body: { padding: '8px 0' } }}
        >
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="articleCount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  label={(entry: any) => `${entry.categoryName} ${entry.articleCount}`}
                  labelLine={{ stroke: '#999' }}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} 篇`, '文章数']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Text type="secondary">暂无分类数据</Text>
            </div>
          )}
        </Card>

        {/* 热门文章 Top 5（柱状图） */}
        <Card
          title={
            <Space>
              <FireOutlined style={{ color: '#f5576c' }} />
              <span>热门文章 Top 5</span>
            </Space>
          }
          style={{ borderRadius: 12 }}
          styles={{ body: { padding: '8px 8px 0' } }}
        >
          {topArticles.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topArticles} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: '#888' }}
                  axisLine={{ stroke: '#e8e8e8' }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="title"
                  width={120}
                  tick={{ fontSize: 12, fill: '#555' }}
                  axisLine={false}
                  tickLine={false}
                  // 标题过长时截断
                  tickFormatter={(val: string) => (val.length > 8 ? `${val.slice(0, 8)}...` : val)}
                />
                <ReTooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} 次`, '浏览量']}
                />
                <Bar
                  dataKey="viewCount"
                  fill="url(#barGradient)"
                  radius={[0, 6, 6, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Text type="secondary">暂无文章数据</Text>
            </div>
          )}
        </Card>
      </div>

      {/* 最近文章 */}
      <Card
        title="最近文章"
        style={{ borderRadius: 12 }}
        styles={{ body: { padding: 0 } }}
      >
        <Table<RecentArticle>
          rowKey="id"
          columns={columns}
          dataSource={recentArticles}
          pagination={false}
          size="middle"
          locale={{ emptyText: <Text type="secondary">暂无文章</Text> }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
