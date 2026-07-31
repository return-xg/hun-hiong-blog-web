import { useState } from 'react';
import { Modal, Form, Input, Button, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { login, getCurrentUser } from '@/api/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { USER_ROLE } from '@/utils/constants';
import type { LoginRequest, LoginVO } from '@/types/auth';

const { Title } = Typography;

const LoginModal: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { loginModalOpen, closeLoginModal, openRegisterModal } = useAppStore();
  const [form] = Form.useForm();

  /** 登录成功 */
  const handleFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const res = await login(values);
      const { accessToken, refreshToken } = res.data as LoginVO;

      // 存储双 Token
      useAuthStore.getState().refreshAuth(accessToken, refreshToken, null);

      // 获取当前用户信息
      const userRes = await getCurrentUser();
      const user = userRes.data;
      useAuthStore.getState().setUser(user);

      closeLoginModal();
      form.resetFields();

      // 只有管理员才能进入后台
      if (user.role === USER_ROLE.ADMIN) {
        message.success('登录成功');
        navigate('/admin');
      } else {
        // 普通用户登录成功，关闭弹窗留在当前页（为评论功能预留）
        message.success('登录成功');
      }
    } catch {
      // 错误已在 request 拦截器中统一处理
    } finally {
      setLoading(false);
    }
  };

  /** 关闭弹窗 */
  const handleCancel = () => {
    closeLoginModal();
    form.resetFields();
  };

  /** 切换到注册弹窗 */
  const handleSwitchToRegister = () => {
    closeLoginModal();
    openRegisterModal();
  };

  return (
    <Modal
      open={loginModalOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={400}
    >
      <Space direction="vertical" size="large" style={{ width: '100%', padding: '16px 0' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>
          登录 Hun Hiong Blog
        </Title>

        <Form
          form={form}
          name="login"
          size="large"
          onFinish={handleFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少 3 个字符' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少 6 个字符' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            还没有账号？ <a onClick={handleSwitchToRegister}>立即注册</a>
          </div>
        </Form>
      </Space>
    </Modal>
  );
};

export default LoginModal;
