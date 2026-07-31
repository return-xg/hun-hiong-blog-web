import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Table, Tag, Spin, Space } from 'antd';
import {
  FileTextOutlined,
  FolderOutlined,
  TagsOutlined,
  EyeOutlined,
  LikeOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

import { getDashboardOverview, getDashboardTrend, getRecentArticles } from '@/api/dashboard';
import type { DashboardOverview, DailyViewTrend, RecentArticle } from '@/types/dashboard';

const { Title, Text } = Typography;

/** 统计卡片配置 */
const STAT_CARDS = [
  { key: 'articleCount', label: '文章总数', icon: <FileTextOutlined />, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { key: 'categoryCount', label: '分类总数', icon: <FolderOutlined />, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { key: 'tagCount', label: '标签总数', icon: <TagsOutlined />, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { key: 'viewCount', label: '总浏览量', icon: <EyeOutlined />, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { key: 'likeCount', label: '总点赞数', icon: <LikeOutlined />, gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
] as const;

/** 格式化数字：超过 1000 显示 x.xk */
const formatNumber = (num: number): string => {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}w`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
};

const Dashboard: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [trend, setTrend] = useState<DailyViewTrend[]>([]);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [loading, setLoading] = useState(true);

  /** 加载所有仪表盘数据 */
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getDashboardOverview(),
      getDashboardTrend(),
      getRecentArticles(),
    ])
      .then(([overviewRes, trendRes, articlesRes]) => {
        setOverview((overviewRes as any).data);
        setTrend((trendRes as any).data);
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
      render: (text: string) => text ? <Tag>{text}</Tag> : '-',
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
      title: '发布时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
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

      {/* 浏览趋势图 */}
      <Card
        title={
          <Space>
            <ArrowUpOutlined style={{ color: '#52c41a' }} />
            <span>近 7 天浏览趋势</span>
          </Space>
        }
        style={{ marginBottom: 24, borderRadius: 12 }}
        styles={{ body: { padding: '16px 8px 8px' } }}
      >
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="viewGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#888' }}
              axisLine={{ stroke: '#e8e8e8' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#888' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              formatter={(value) => [`${value} 次`, '浏览量']}
            />
            <Area
              type="monotone"
              dataKey="viewCount"
              stroke="#667eea"
              strokeWidth={2.5}
              fill="url(#viewGradient)"
              dot={{ r: 4, fill: '#667eea', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#667eea', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

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
