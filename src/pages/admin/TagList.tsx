import React, { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Space,
  Tag as AntTag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Tag } from '@/types/tag';
import {
  getTagList,
  createTag,
  updateTag,
  deleteTag,
  batchDeleteTags,
} from '@/api/tag';

const { Title } = Typography;

const TagList: React.FC = () => {
  // 列表数据与分页
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 搜索
  const [searchName, setSearchName] = useState('');

  // 弹窗
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();

  /** 加载标签列表 */
  const fetchList = async (page = 1, pageSize = 10, name = '') => {
    setLoading(true);
    try {
      const res = await getTagList({ current: page, size: pageSize, name: name || undefined });
      const data = (res as any).data;
      setTags(data.records);
      setPagination({
        current: data.current,
        pageSize: data.size,
        total: data.total,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  /** 表格分页变化 */
  const handleTableChange = (paginationConfig: any) => {
    fetchList(paginationConfig.current, paginationConfig.pageSize, searchName);
  };

  /** 搜索 */
  const handleSearch = () => {
    fetchList(1, pagination.pageSize, searchName);
  };

  /** 重置搜索 */
  const handleResetSearch = () => {
    setSearchName('');
    fetchList(1, pagination.pageSize);
  };

  /** 打开新建弹窗 */
  const handleCreate = () => {
    setEditingTag(null);
    form.resetFields();
    setModalOpen(true);
  };

  /** 打开编辑弹窗 */
  const handleEdit = (record: Tag) => {
    setEditingTag(record);
    form.setFieldsValue({
      name: record.name,
      slug: record.slug,
    });
    setModalOpen(true);
  };

  /** 删除单个标签 */
  const handleDelete = async (id: number) => {
    await deleteTag(id);
    message.success('删除成功');
    fetchList(pagination.current, pagination.pageSize, searchName);
  };

  /** 批量删除标签 */
  const handleBatchDelete = async () => {
    await batchDeleteTags(selectedRowKeys as number[]);
    message.success('批量删除成功');
    setSelectedRowKeys([]);
    fetchList(pagination.current, pagination.pageSize, searchName);
  };

  /** 弹窗确认（新建 / 编辑） */
  const handleModalOk = async () => {
    const values = await form.validateFields();
    setConfirmLoading(true);
    try {
      if (editingTag) {
        await updateTag(editingTag.id, values);
        message.success('更新成功');
      } else {
        await createTag(values);
        message.success('创建成功');
      }
      setModalOpen(false);
      form.resetFields();
      fetchList(pagination.current, pagination.pageSize, searchName);
    } finally {
      setConfirmLoading(false);
    }
  };

  /** 弹窗取消 */
  const handleModalCancel = () => {
    setModalOpen(false);
    form.resetFields();
  };

  /** 表格列定义 */
  const columns: ColumnsType<Tag> = [
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <AntTag color="blue">{name}</AntTag>,
    },
    {
      title: '别名',
      dataIndex: 'slug',
      key: 'slug',
      ellipsis: true,
      render: (slug: string) => slug || '-',
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
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除该标签吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 页头 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>标签管理</Title>
        <Space>
          <Popconfirm
            title={`确认删除选中的 ${selectedRowKeys.length} 个标签吗？`}
            onConfirm={handleBatchDelete}
            okText="确认"
            cancelText="取消"
            disabled={selectedRowKeys.length === 0}
          >
            <Button danger disabled={selectedRowKeys.length === 0}>
              批量删除
            </Button>
          </Popconfirm>
          <Button type="primary" onClick={handleCreate}>
            新建标签
          </Button>
        </Space>
      </div>

      {/* 搜索栏 */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Input
          placeholder="搜索标签名称"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 240 }}
          allowClear
        />
        <Button type="primary" onClick={handleSearch}>搜索</Button>
        <Button onClick={handleResetSearch}>重置</Button>
      </div>

      {/* 数据表格 */}
      <Table<Tag>
        rowKey="id"
        columns={columns}
        dataSource={tags}
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

      {/* 新建 / 编辑弹窗 */}
      <Modal
        title={editingTag ? '编辑标签' : '新建标签'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={confirmLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
          <Form.Item name="slug" label="别名">
            <Input placeholder="请输入别名（选填，用于 URL 友好展示）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagList;
