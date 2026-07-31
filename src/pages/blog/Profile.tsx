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

/** 个人中心页面 */
const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser, setUser, isAuthenticated } = useAuthStore();

  // 个人信息表单
  const [profileForm] = Form.useForm();
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(authUser?.avatar);

  // 修改密码表单
  const [passwordForm] = Form.useForm();
  const [passwordLoading, setPasswordLoading] = useState(false);

  // 未登录重定向
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 加载最新用户信息
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

  /** 提交个人信息修改 */
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
      // 表单校验失败或请求错误（拦截器已提示）
    } finally {
      setProfileLoading(false);
    }
  };

  /** 提交密码修改 */
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
        // 修改密码后退出登录
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

  /** 上传头像前校验 */
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

  /** 自定义上传头像 */
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
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Title level={3}>个人中心</Title>

      {/* 个人信息 */}
      <Card title="个人信息" style={{ marginBottom: 24 }}>
        <Form form={profileForm} layout="vertical">
          <Form.Item label="账号">
            <Input value={authUser?.username ?? ''} disabled />
          </Form.Item>

          <Form.Item label="头像">
            <Space align="center">
              <Avatar size={64} src={getFileUrl(avatarUrl)} icon={<UserOutlined />} />
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

      <Divider />

      {/* 修改密码 */}
      <Card title="修改密码">
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
