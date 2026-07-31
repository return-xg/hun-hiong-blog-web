import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { login, getCurrentUser } from '@/api/auth';
import { useAuthStore } from '@/store/useAuthStore';
import type { LoginRequest, LoginVO } from '@/types/auth';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const res = await login(values);
      const { accessToken, refreshToken } = res.data as LoginVO;

      useAuthStore.getState().refreshAuth(accessToken, refreshToken, null);

      const userRes = await getCurrentUser();
      const user = userRes.data;
      useAuthStore.getState().setUser(user);

      message.success('登录成功');
      navigate('/admin');
    } catch {
      // 错误已在 request 拦截器中统一处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--bg-hero)',
      }}
    >
      <Card
        style={{
          width: 420,
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-float)',
          border: 'none',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title
            level={3}
            style={{
              textAlign: 'center',
              marginBottom: 0,
              fontFamily: 'var(--font-serif)',
              color: 'var(--primary-color)',
            }}
          >
            欢迎回来
          </Title>

          <Form
            name="login"
            size="large"
            onFinish={onFinish}
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
              <Button type="primary" htmlType="submit" loading={loading} block shape="round">
                登录
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              还没有账号？ <Link to="/register">立即注册</Link>
            </div>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
