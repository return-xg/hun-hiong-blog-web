import { useState } from 'react';
import { Modal, Form, Input, Button, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';

import { register } from '@/api/auth';
import { useAppStore } from '@/store/useAppStore';
import type { RegisterRequest } from '@/types/auth';

const { Title } = Typography;

interface RegisterFormValues extends RegisterRequest {
  confirmPassword: string;
}

const RegisterModal: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const { registerModalOpen, closeRegisterModal, openLoginModal } = useAppStore();
  const [form] = Form.useForm();

  /** 注册成功 */
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

      // 切换到登录弹窗
      openLoginModal();
    } catch {
      // 错误已在 request 拦截器中统一处理
    } finally {
      setLoading(false);
    }
  };

  /** 关闭弹窗 */
  const handleCancel = () => {
    closeRegisterModal();
    form.resetFields();
  };

  /** 切换到登录弹窗 */
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
      width={400}
    >
      <Space direction="vertical" size="large" style={{ width: '100%', padding: '16px 0' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>
          注册 Hun Hiong Blog
        </Title>

        <Form
          form={form}
          name="register"
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
            <Button type="primary" htmlType="submit" loading={loading} block>
              注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            已有账号？ <a onClick={handleSwitchToLogin}>去登录</a>
          </div>
        </Form>
      </Space>
    </Modal>
  );
};

export default RegisterModal;
