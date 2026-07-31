import { useState } from 'react';
import { Modal, Form, Input, Button, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';

import { register } from '@/api/auth';
import { useAppStore } from '@/store/useAppStore';
import type { RegisterRequest } from '@/types/auth';

const { Title, Text } = Typography;

interface RegisterFormValues extends RegisterRequest {
  confirmPassword: string;
}

const RegisterModal: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const { registerModalOpen, closeRegisterModal, openLoginModal } = useAppStore();
  const [form] = Form.useForm();

  const handleFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      await register({
        username: values.username,
        password: values.password,
        nickname: values.nickname,
      });

      message.success('注册成功，请登录');
      closeRegisterModal();
      form.resetFields();

      openLoginModal();
    } catch {
      // 错误已在 request 拦截器中统一处理
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    closeRegisterModal();
    form.resetFields();
  };

  const handleSwitchToLogin = () => {
    closeRegisterModal();
    openLoginModal();
  };

  return (
    <Modal
      open={registerModalOpen}
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
            background: 'var(--accent-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 22,
            color: 'var(--accent-color)',
          }}
        >
          <IdcardOutlined />
        </div>
        <Title
          level={3}
          style={{
            marginBottom: 4,
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-color)',
          }}
        >
          创建账号
        </Title>
        <Text style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          加入我们，开始记录你的故事
        </Text>
      </div>

      {/* 表单区域 */}
      <div style={{ padding: '20px 28px 24px' }}>
        <Form
          form={form}
          name="register"
          size="large"
          onFinish={handleFinish}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
          style={{ rowGap: '12px' }}
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
            name="nickname"
            label="昵称"
            style={{ marginBottom: 4 }}
            rules={[
              { max: 64, message: '昵称不超过 64 个字符' },
            ]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="选填，给自己取个名字" />
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

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            style={{ marginBottom: 4 }}
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
            <Input.Password prefix={<LockOutlined />} placeholder="请再次输入密码" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 12 }}>
            <Button type="primary" htmlType="submit" loading={loading} block shape="round">
              注册
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '12px 0', borderColor: 'var(--border-light)' }} />

        <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          已有账号？
          <a
            onClick={handleSwitchToLogin}
            style={{
              color: 'var(--primary-color)',
              fontWeight: 500,
              marginLeft: 4,
              cursor: 'pointer',
            }}
          >
            去登录
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterModal;
