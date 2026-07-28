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
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Category } from '@/types/category';
import {
  getCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/api/category';

const { Title } = Typography;

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();

  const fetchList = async (page = 1, pageSize = 10) => {
    setLoading(true);
    const res = await getCategoryList({ current: page, size: pageSize });
    const data = (res as any).data;
    setCategories(data.records);
    setPagination({
      current: data.current,
      pageSize: data.size,
      total: data.total,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleTableChange = (paginationConfig: any) => {
    fetchList(paginationConfig.current, paginationConfig.pageSize);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: Category) => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      slug: record.slug,
      sort: record.sort,
      description: record.description,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteCategory([id]);
    message.success('删除成功');
    fetchList(pagination.current, pagination.pageSize);
  };

  const handleBatchDelete = async () => {
    await deleteCategory(selectedRowKeys as string[]);
    message.success('批量删除成功');
    setSelectedRowKeys([]);
    fetchList(pagination.current, pagination.pageSize);
  };

  const handleModalOk = async () => {
    const values = await form.validateFields();
    setConfirmLoading(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        message.success('更新成功');
      } else {
        await createCategory(values);
        message.success('创建成功');
      }
      setModalOpen(false);
      form.resetFields();
      fetchList(pagination.current, pagination.pageSize);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    form.resetFields();
  };

  const columns: ColumnsType<Category> = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '别名',
      dataIndex: 'slug',
      key: 'slug',
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
            title="确认删除该分类吗？"
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>分类管理</Title>
        <Space>
          <Popconfirm
            title={`确认删除选中的 ${selectedRowKeys.length} 个分类吗？`}
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
            新建分类
          </Button>
        </Space>
      </div>

      <Table<Category>
        rowKey="id"
        columns={columns}
        dataSource={categories}
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

      <Modal
        title={editingCategory ? '编辑分类' : '新建分类'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={confirmLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item name="slug" label="别名">
            <Input placeholder="请输入别名（选填）" />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <Input type="number" placeholder="请输入排序值（选填）" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入描述（选填）" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
