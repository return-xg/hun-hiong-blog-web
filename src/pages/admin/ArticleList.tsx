import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Badge,
  Popconfirm,
  message,
  Space,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { getArticleList, deleteArticle, batchDeleteArticles } from '@/api/article';
import { getCategoryList } from '@/api/category';
import type { Article } from '@/types/article';
import type { Category } from '@/types/category';
import { ARTICLE_STATUS, ARTICLE_STATUS_MAP, DEFAULT_PAGE_SIZE } from '@/utils/constants';

const { Title } = Typography;

/** 文章状态 Badge 颜色映射 */
const STATUS_BADGE_MAP: Record<number, 'default' | 'processing' | 'success' | 'error'> = {
  [ARTICLE_STATUS.DRAFT]: 'default',
  [ARTICLE_STATUS.PUBLISHED]: 'success',
};

const ArticleList: React.FC = () => {
  const navigate = useNavigate();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: DEFAULT_PAGE_SIZE, total: 0 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 搜索筛选条件
  const [searchTitle, setSearchTitle] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState<number | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);

  // 分类下拉数据
  const [categories, setCategories] = useState<Category[]>([]);

  /** 加载文章列表 */
  const fetchList = async (page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
    setLoading(true);
    try {
      const res = await getArticleList({
        current: page,
        size: pageSize,
        title: searchTitle || undefined,
        categoryId: filterCategoryId,
        status: filterStatus,
      });
      const data = (res as any).data;
      setArticles(data.records);
      setPagination({
        current: data.current,
        pageSize: data.size,
        total: data.total,
      });
    } finally {
      setLoading(false);
    }
  };

  /** 加载分类列表（用于下拉筛选） */
  const fetchCategories = async () => {
    const res = await getCategoryList({ current: 1, size: 1000 });
    const data = (res as any).data;
    setCategories(data.records);
  };

  useEffect(() => {
    fetchCategories();
    fetchList();
  }, []);

  /** 搜索 */
  const handleSearch = () => {
    fetchList(1, pagination.pageSize);
  };

  /** 重置筛选 */
  const handleReset = () => {
    setSearchTitle('');
    setFilterCategoryId(undefined);
    setFilterStatus(undefined);
    // 重置后立即刷新
    fetchList(1, pagination.pageSize);
  };

  /** 表格分页变化 */
  const handleTableChange = (paginationConfig: any) => {
    fetchList(paginationConfig.current, paginationConfig.pageSize);
  };

  /** 删除单篇文章 */
  const handleDelete = async (id: string | number) => {
    await deleteArticle(id);
    message.success('删除成功');
    fetchList(pagination.current, pagination.pageSize);
  };

  /** 批量删除 */
  const handleBatchDelete = async () => {
    await batchDeleteArticles(selectedRowKeys as string[]);
    message.success('批量删除成功');
    setSelectedRowKeys([]);
    fetchList(pagination.current, pagination.pageSize);
  };

  /** 跳转到新建文章 */
  const handleCreate = () => {
    navigate('/admin/articles/create');
  };

  /** 跳转到编辑文章 */
  const handleEdit = (id: string | number) => {
    navigate(`/admin/articles/edit/${id}`);
  };

  const columns: ColumnsType<Article> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 120,
      render: (text: string) => text || '-',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: Article['tags']) =>
        tags && tags.length > 0
          ? tags.map((tag) => (
              <Tag key={tag.id}>
                {tag.name}
              </Tag>
            ))
          : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Badge status={STATUS_BADGE_MAP[status] || 'default'} text={ARTICLE_STATUS_MAP[status] || '未知'} />
      ),
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 90,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除该文章吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>文章管理</Title>
        <Space>
          <Popconfirm
            title={`确认删除选中的 ${selectedRowKeys.length} 篇文章吗？`}
            onConfirm={handleBatchDelete}
            okText="确认"
            cancelText="取消"
            disabled={selectedRowKeys.length === 0}
          >
            <Button danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0}>
              批量删除
            </Button>
          </Popconfirm>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建文章
          </Button>
        </Space>
      </div>

      {/* 搜索筛选区域 */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="搜索文章标题"
          prefix={<SearchOutlined />}
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 220 }}
          allowClear
        />
        <Select
          placeholder="选择分类"
          value={filterCategoryId}
          onChange={(val) => setFilterCategoryId(val)}
          allowClear
          style={{ width: 160 }}
          options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
        />
        <Select
          placeholder="文章状态"
          value={filterStatus}
          onChange={(val) => setFilterStatus(val)}
          allowClear
          style={{ width: 140 }}
          options={[
            { label: '草稿', value: ARTICLE_STATUS.DRAFT },
            { label: '已发布', value: ARTICLE_STATUS.PUBLISHED },
          ]}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          搜索
        </Button>
        <Button onClick={handleReset}>重置</Button>
      </Space>

      <Table<Article>
        rowKey="id"
        columns={columns}
        dataSource={articles}
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ArticleList;
