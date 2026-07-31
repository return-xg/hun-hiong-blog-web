import { useState } from 'react';
import { Modal, Form, Input, Button, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { login, getCurrentUser } from '@/api/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { USER_ROLE } from '@/utils/constants';
import type { LoginRequest, LoginVO } from '@/types/auth';

const { Title, Text } = Typography;

const LoginModal: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { loginModalOpen, closeLoginModal, openRegisterModal } = useAppStore();
  const [form] = Form.useForm();

  const handleFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const res = await login(values);
      const { accessToken, refreshToken } = res.data as LoginVO;

      useAuthStore.getState().refreshAuth(accessToken, refreshToken, null);

      const userRes = await getCurrentUser();
      const user = userRes.data;
      useAuthStore.getState().setUser(user);

      closeLoginModal();
      form.resetFields();

      if (user.role === USER_ROLE.ADMIN) {
        message.success('登录成功');
        navigate('/admin');
      } else {
        message.success('登录成功');
      }
    } catch {
      // 错误已在 request 拦截器中统一处理
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    closeLoginModal();
    form.resetFields();
  };

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
      width={420}
      centered
      styles={{
        content: {
          borderRadius: 20,
          padding: 0,
          overflow: 'hidden',
        },
        body: {
          padding: 0,
        },
      }}
    >
      {/* 顶部装饰区 */}
      <div
        style={{
          background: 'var(--bg-hero)',
          padding: '24px 28px 20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 22,
            color: 'var(--primary-color)',
          }}
        >
          <UserOutlined />
        </div>
        <Title
          level={3}
          style={{
            marginBottom: 4,
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-color)',
          }}
        >
          欢迎回来
        </Title>
        <Text style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          登录你的账号，继续浏览
        </Text>
      </div>

      {/* 表单区域 */}
      <div style={{ padding: '20px 28px 24px' }}>
        <Form
          form={form}
          name="login"
          size="large"
          onFinish={handleFinish}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
          style={{ rowGap: 4 }}
        >
          <Form.Item
            name="username"
            label="用户名"
            style={{ marginBottom: 4 }}
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少 3 个字符' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            style={{ marginBottom: 4 }}
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少 6 个字符' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 12 }}>
            <Button type="primary" htmlType="submit" loading={loading} block shape="round">
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '12px 0', borderColor: 'var(--border-light)' }} />

        <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          还没有账号？
          <a
            onClick={handleSwitchToRegister}
            style={{
              color: 'var(--primary-color)',
              fontWeight: 500,
              marginLeft: 4,
              cursor: 'pointer',
            }}
          >
            立即注册
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
