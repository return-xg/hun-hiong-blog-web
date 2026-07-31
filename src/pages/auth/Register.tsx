import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '@/api/auth';
import type { RegisterRequest } from '@/types/auth';

const { Title } = Typography;

interface RegisterFormValues extends RegisterRequest {
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      await register({
        username: values.username,
        password: values.password,
        nickname: values.nickname,
      });

      message.success('注册成功，请登录');
      navigate('/');
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
            创建账号
          </Title>

          <Form
            name="register"
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
              name="nickname"
              rules={[
                { max: 64, message: '昵称不超过 64 个字符' },
              ]}
            >
              <Input prefix={<IdcardOutlined />} placeholder="昵称（选填）" />
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

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block shape="round">
                注册
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 16 }}>
              <Link to="/">返回首页</Link>
              <span>已有账号？ <Link to="/">去登录</Link></span>
            </div>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default Register;
