import { Typography } from 'antd';

const { Title } = Typography;

const Login: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div>
        <Title level={3}>登录</Title>
        <p>开发中...</p>
      </div>
    </div>
  );
};

export default Login;
