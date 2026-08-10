import { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Popconfirm,
  message,
  Space,
  Tag,
  Image,
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { uploadMusic, updateMusic } from '@/api/music';
import { uploadFile } from '@/api/file';
import { useMusicManageStore } from '@/store/useMusicManageStore';
import { getFileUrl, MUSIC_STATUS, MUSIC_STATUS_MAP, MUSIC_ACCEPT_TYPES } from '@/utils/constants';
import type { Music } from '@/types/music';

const { Title } = Typography;

/** 格式化时长（秒 → mm:ss） */
const formatDuration = (seconds: number): string => {
  if (!seconds) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const MusicManage: React.FC = () => {
  const { musicList, loading, pagination, fetchList, setQuery, batchRemove } = useMusicManageStore();

  // 搜索表单
  const [searchForm] = Form.useForm();

  // 上传弹窗
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm] = Form.useForm();
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // 编辑弹窗
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMusic, setEditingMusic] = useState<Music | null>(null);
  const [editConfirmLoading, setEditConfirmLoading] = useState(false);
  const [editForm] = Form.useForm();
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);

  // 批量选择
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // ========== 搜索操作 ==========

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    setQuery(values);
  };

  const handleResetSearch = () => {
    searchForm.resetFields();
    setQuery({});
  };

  // ========== 表格操作 ==========

  const handleTableChange = (paginationConfig: { current?: number; pageSize?: number }) => {
    fetchList(paginationConfig.current, paginationConfig.pageSize);
  };

  // ========== 上传操作 ==========

  const handleOpenUpload = () => {
    uploadForm.resetFields();
    setAudioFile(null);
    setUploadModalOpen(true);
  };

  const handleUploadOk = async () => {
    const values = await uploadForm.validateFields();
    if (!audioFile) {
      message.warning('请选择歌曲文件');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('title', values.title);
      if (values.artist) {
        formData.append('artist', values.artist);
      }
      await uploadMusic(formData);
      message.success('上传成功');
      setUploadModalOpen(false);
      uploadForm.resetFields();
      setAudioFile(null);
      fetchList(pagination.current, pagination.pageSize);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadCancel = () => {
    setUploadModalOpen(false);
    uploadForm.resetFields();
    setAudioFile(null);
  };

  // ========== 编辑操作 ==========

  const handleEdit = (record: Music) => {
    setEditingMusic(record);
    setEditCoverFile(null);
    editForm.setFieldsValue({
      title: record.title,
      artist: record.artist,
      duration: record.duration,
      sort: record.sort,
      status: record.status,
    });
    setEditModalOpen(true);
  };

  const handleEditOk = async () => {
    if (!editingMusic) return;
    const values = await editForm.validateFields();
    setEditConfirmLoading(true);
    try {
      // 如果选择了新封面文件，先上传获取 URL
      if (editCoverFile) {
        const fileResult = await uploadFile(editCoverFile);
        if (fileResult.code === 0) {
          values.cover = fileResult.data.url;
        }
      }
      await updateMusic(editingMusic.id, values);
      message.success('更新成功');
      setEditModalOpen(false);
      editForm.resetFields();
      setEditCoverFile(null);
      fetchList(pagination.current, pagination.pageSize);
    } finally {
      setEditConfirmLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    editForm.resetFields();
    setEditCoverFile(null);
  };

  // ========== 删除操作 ==========

  const handleBatchDelete = async () => {
    await batchRemove(selectedRowKeys as number[]);
    message.success(`已删除 ${selectedRowKeys.length} 首歌曲`);
    setSelectedRowKeys([]);
  };

  // ========== 表格列定义 ==========

  const columns: ColumnsType<Music> = [
    {
      title: '封面',
      dataIndex: 'cover',
      key: 'cover',
      width: 80,
      render: (cover: string) => {
        const url = getFileUrl(cover);
        return url ? (
          <Image src={url} alt="封面" width={48} height={48} style={{ objectFit: 'cover', borderRadius: 4 }} preview={false} />
        ) : (
          <div style={{ width: 48, height: 48, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            无
          </div>
        );
      },
    },
    {
      title: '歌曲名',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '歌手',
      dataIndex: 'artist',
      key: 'artist',
      ellipsis: true,
      render: (artist: string) => artist || '-',
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration: number) => formatDuration(duration),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => {
        const color = status === MUSIC_STATUS.ENABLED ? 'green' : 'red';
        return <Tag color={color}>{MUSIC_STATUS_MAP[status]}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          编辑
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>音乐管理</Title>
        <Button type="primary" icon={<UploadOutlined />} onClick={handleOpenUpload}>
          上传音乐
        </Button>
      </div>

      {/* 搜索栏 */}
      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="title">
          <Input placeholder="歌曲名称" allowClear />
        </Form.Item>
        <Form.Item name="artist">
          <Input placeholder="歌手" allowClear />
        </Form.Item>
        <Form.Item name="status">
          <Select
            placeholder="状态"
            allowClear
            style={{ width: 100 }}
            options={[
              { value: MUSIC_STATUS.ENABLED, label: '启用' },
              { value: MUSIC_STATUS.DISABLED, label: '禁用' },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleResetSearch}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 批量操作栏 */}
      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Popconfirm
            title={`确认删除选中的 ${selectedRowKeys.length} 首歌曲吗？`}
            onConfirm={handleBatchDelete}
            okText="确认"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />}>
              批量删除（{selectedRowKeys.length}）
            </Button>
          </Popconfirm>
        </div>
      )}

      <Table<Music>
        rowKey="id"
        columns={columns}
        dataSource={musicList}
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

      {/* 上传弹窗 */}
      <Modal
        title="上传音乐"
        open={uploadModalOpen}
        onOk={handleUploadOk}
        onCancel={handleUploadCancel}
        confirmLoading={uploading}
        okText="上传"
        cancelText="取消"
      >
        <Form form={uploadForm} layout="vertical">
          <Form.Item
            label="歌曲文件"
            required
            extra="支持 MP3、FLAC 等格式"
          >
            <Upload
              beforeUpload={(file) => {
                setAudioFile(file);
                return false;
              }}
              maxCount={1}
              accept={MUSIC_ACCEPT_TYPES}
              onRemove={() => setAudioFile(null)}
            >
              <Button icon={<PlusOutlined />}>选择歌曲文件</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="title"
            label="歌曲名称"
            rules={[{ required: true, message: '请输入歌曲名称' }]}
          >
            <Input placeholder="请输入歌曲名称" />
          </Form.Item>
          <Form.Item
            name="artist"
            label="歌手"
          >
            <Input placeholder="请输入歌手（选填）" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑弹窗 */}
      <Modal
        title="编辑音乐"
        open={editModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        confirmLoading={editConfirmLoading}
        okText="保存"
        cancelText="取消"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="title" label="歌曲名称">
            <Input placeholder="请输入歌曲名称" />
          </Form.Item>
          <Form.Item name="artist" label="歌手">
            <Input placeholder="请输入歌手" />
          </Form.Item>
          <Form.Item label="封面图片" extra="选填，支持 JPG/PNG 格式，不上传则保留原封面">
            {editingMusic?.cover && !editCoverFile && (
              <div style={{ marginBottom: 8 }}>
                <Image
                  src={getFileUrl(editingMusic.cover)}
                  alt="当前封面"
                  width={64}
                  height={64}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                  preview={false}
                />
              </div>
            )}
            <Upload
              beforeUpload={(file) => {
                setEditCoverFile(file);
                return false;
              }}
              maxCount={1}
              accept=".jpg,.jpeg,.png"
              onRemove={() => setEditCoverFile(null)}
              listType="picture"
            >
              <Button icon={<PlusOutlined />}>{editCoverFile ? '更换封面' : '选择封面图片'}</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="duration" label="时长（秒）">
            <InputNumber min={0} placeholder="请输入时长" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <InputNumber min={0} placeholder="请输入排序值" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              options={[
                { value: MUSIC_STATUS.ENABLED, label: '启用' },
                { value: MUSIC_STATUS.DISABLED, label: '禁用' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MusicManage;
