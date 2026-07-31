import React, { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Popconfirm,
  message,
  Space,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { getUserList, updateUser, deleteUser } from '@/api/user';
import type { User } from '@/types/user';
import { USER_STATUS, USER_STATUS_MAP, USER_ROLE, USER_ROLE_MAP } from '@/utils/constants';
import { useAuthStore } from '@/store/useAuthStore';

const { Title } = Typography;

const UserList: React.FC = () => {
  // 列表数据与分页
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 搜索
  const [searchUsername, setSearchUsername] = useState('');

  // 弹窗
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();

  // 当前登录用户
  const currentUser = useAuthStore((state) => state.user);

  /** 加载用户列表 */
  const fetchList = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await getUserList({ current: page, size: pageSize });
      const data = (res as any).data;
      // 前端过滤搜索（后端分页接口不支持搜索时）
      let records: User[] = data.records;
      if (searchUsername) {
        records = records.filter((user) =>
          user.username.toLowerCase().includes(searchUsername.toLowerCase()) ||
          user.nickname?.toLowerCase().includes(searchUsername.toLowerCase())
        );
      }
      setUsers(records);
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
    fetchList(paginationConfig.current, paginationConfig.pageSize);
  };

  /** 搜索 */
  const handleSearch = () => {
    fetchList(1, pagination.pageSize);
  };

  /** 重置搜索 */
  const handleResetSearch = () => {
    setSearchUsername('');
    fetchList(1, pagination.pageSize);
  };

  /** 打开编辑弹窗 */
  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue({
      nickname: record.nickname,
      role: record.role,
    });
    setModalOpen(true);
  };

  /** 删除单个用户 */
  const handleDelete = async (id: number) => {
    await deleteUser(id);
    message.success('删除成功');
    fetchList(pagination.current, pagination.pageSize);
  };

  /** 批量删除用户 */
  const handleBatchDelete = async () => {
    for (const id of selectedRowKeys) {
      await deleteUser(Number(id));
    }
    message.success('批量删除成功');
    setSelectedRowKeys([]);
    fetchList(pagination.current, pagination.pageSize);
  };

  /** 切换用户状态（启用/禁用） */
  const handleToggleStatus = async (record: User) => {
    const newStatus = record.status === USER_STATUS.ENABLED
      ? USER_STATUS.DISABLED
      : USER_STATUS.ENABLED;
    await updateUser(record.id, { status: newStatus });
    message.success(newStatus === USER_STATUS.ENABLED ? '已启用' : '已禁用');
    fetchList(pagination.current, pagination.pageSize);
  };

  /** 弹窗确认（编辑） */
  const handleModalOk = async () => {
    const values = await form.validateFields();
    setConfirmLoading(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          nickname: values.nickname,
          role: values.role,
        });
        message.success('更新成功');
        setModalOpen(false);
        form.resetFields();
        fetchList(pagination.current, pagination.pageSize);
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  /** 弹窗取消 */
  const handleModalCancel = () => {
    setModalOpen(false);
    form.resetFields();
  };

  /** 判断是否是当前登录用户 */
  const isCurrentUser = (userId: number) => currentUser?.id === userId;

  /** 判断是否是管理员（管理员不可被禁用/删除） */
  const isAdmin = (record: User) => record.role === USER_ROLE.ADMIN;

  const columns: ColumnsType<User> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text: string) => text || '-',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => (
        <Tag color={role === USER_ROLE.ADMIN ? 'blue' : 'default'}>
          {USER_ROLE_MAP[role] || role}
        </Tag>
      ),
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (url: string) =>
        url ? (
          <img src={url} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
        ) : (
          '-'
        ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number, record: User) => (
        <Space>
          <Tag color={status === USER_STATUS.ENABLED ? 'green' : 'red'}>
            {USER_STATUS_MAP[status] || '未知'}
          </Tag>
          {!isCurrentUser(record.id) && !isAdmin(record) && (
            <Switch
              size="small"
              checked={status === USER_STATUS.ENABLED}
              onChange={() => handleToggleStatus(record)}
            />
          )}
        </Space>
      ),
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
          {!isCurrentUser(record.id) && !isAdmin(record) && (
            <Popconfirm
              title="确认删除该用户吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link" size="small" danger>
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 页头 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>用户管理</Title>
        <Popconfirm
          title={`确认删除选中的 ${selectedRowKeys.length} 个用户吗？`}
          onConfirm={handleBatchDelete}
          okText="确认"
          cancelText="取消"
          disabled={selectedRowKeys.length === 0}
        >
          <Button danger disabled={selectedRowKeys.length === 0}>
            批量删除
          </Button>
        </Popconfirm>
      </div>

      {/* 搜索栏 */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Input
          placeholder="搜索用户名或昵称"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 240 }}
          allowClear
        />
        <Button type="primary" onClick={handleSearch}>搜索</Button>
        <Button onClick={handleResetSearch}>重置</Button>
      </div>

      {/* 数据表格 */}
      <Table<User>
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
          getCheckboxProps: (record: User) => ({
            disabled: isCurrentUser(record.id) || isAdmin(record),
          }),
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

      {/* 编辑弹窗 */}
      <Modal
        title="编辑用户"
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={confirmLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nickname"
            label="昵称"
          >
            <Input placeholder="请输入昵称（选填）" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
          >
            <Select
              options={[
                { label: '普通用户', value: USER_ROLE.USER },
                { label: '管理员', value: USER_ROLE.ADMIN },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
