import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  message,
  Typography,
  Divider,
  Space,
} from 'antd';
import { UserOutlined, UploadOutlined, LockOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';

import { getCurrentUser, updateProfile, changePassword } from '@/api/auth';
import { uploadFile } from '@/api/file';
import { useAuthStore } from '@/store/useAuthStore';
import { getFileUrl } from '@/utils/constants';

const { Title } = Typography;

/** 卡片通用样式 */
const cardStyle: React.CSSProperties = {
  borderRadius: 'var(--radius-card)',
  border: '1px solid var(--border-light)',
  boxShadow: 'var(--shadow-sm)',
};

/** 个人中心页面 */
const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser, setUser, isAuthenticated } = useAuthStore();

  const [profileForm] = Form.useForm();
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(authUser?.avatar);

  const [passwordForm] = Form.useForm();
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const result = await getCurrentUser();
        if (result.code === 0 && result.data) {
          setUser(result.data);
          profileForm.setFieldsValue({
            nickname: result.data.nickname,
            username: result.data.username,
          });
          setAvatarUrl(result.data.avatar);
        }
      } catch {
        // 错误由拦截器处理
      }
    };
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated, setUser, profileForm]);

  const handleProfileSubmit = async () => {
    try {
      const values = await profileForm.validateFields();
      setProfileLoading(true);
      const result = await updateProfile({
        nickname: values.nickname,
        avatar: avatarUrl,
      });
      if (result.code === 0 && result.data) {
        setUser(result.data);
        message.success('个人信息修改成功');
      }
    } catch {
      // 表单校验失败或请求错误
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const values = await passwordForm.validateFields();
      setPasswordLoading(true);
      const result = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      if (result.code === 0) {
        message.success('密码修改成功，请重新登录');
        passwordForm.resetFields();
        setTimeout(() => {
          useAuthStore.getState().logout();
          navigate('/');
        }, 1500);
      }
    } catch {
      // 表单校验失败或请求错误
    } finally {
      setPasswordLoading(false);
    }
  };

  const beforeUpload = (file: UploadFile) => {
    const isImage = file.type?.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件');
      return false;
    }
    const isLt2M = (file.size ?? 0) / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB');
      return false;
    }
    return true;
  };

  const handleAvatarUpload = async (options: { file: File; onSuccess?: () => void; onError?: (err: Error) => void }) => {
    try {
      const result = await uploadFile(options.file);
      if (result.code === 0 && result.data) {
        setAvatarUrl(result.data.url);
        options.onSuccess?.();
      }
    } catch (err) {
      options.onError?.(err instanceof Error ? err : new Error('上传失败'));
    }
  };

  return (
    <div style={{ maxWidth: 580, margin: '0 auto' }}>
      {/* 标题区 */}
      <div
        style={{
          marginBottom: 32,
          padding: '28px 32px',
          background: 'var(--bg-hero)',
          borderRadius: 'var(--radius-card)',
          textAlign: 'center',
        }}
      >
        <Title
          level={3}
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-color)',
            marginBottom: 0,
          }}
        >
          个人中心
        </Title>
      </div>

      {/* 个人信息 */}
      <Card
        title={
          <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-color)', fontSize: 15 }}>
            个人信息
          </span>
        }
        style={{ ...cardStyle, marginBottom: 20 }}
        styles={{ header: { borderBottomColor: 'var(--border-light)' } }}
      >
        <Form form={profileForm} layout="vertical">
          <Form.Item label="账号">
            <Input value={authUser?.username ?? ''} disabled />
          </Form.Item>

          <Form.Item label="头像">
            <Space align="center">
              <Avatar
                size={64}
                src={getFileUrl(avatarUrl)}
                icon={<UserOutlined />}
                style={{ border: '2px solid var(--primary-light)' }}
              />
              <Upload
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={handleAvatarUpload as never}
              >
                <Button icon={<UploadOutlined />}>更换头像</Button>
              </Upload>
            </Space>
          </Form.Item>

          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ max: 20, message: '昵称不能超过20个字符' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" loading={profileLoading} onClick={handleProfileSubmit}>
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Divider style={{ borderColor: 'var(--border-light)' }} />

      {/* 修改密码 */}
      <Card
        title={
          <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-color)', fontSize: 15 }}>
            修改密码
          </span>
        }
        style={cardStyle}
        styles={{ header: { borderBottomColor: 'var(--border-light)' } }}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="oldPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入当前密码" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能少于6位' },
              { max: 20, message: '密码长度不能超过20位' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请再次输入新密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" loading={passwordLoading} onClick={handlePasswordSubmit}>
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
