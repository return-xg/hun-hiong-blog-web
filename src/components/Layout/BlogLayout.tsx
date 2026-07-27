import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
  { key: '/about', icon: <InfoCircleOutlined />, label: <Link to="/about">关于</Link> },
];

const BlogLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 48px',
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginRight: 48,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          Hun Hiong Blog
        </div>
        <Menu
          mode="horizontal"
          items={menuItems}
          style={{ flex: 1, border: 'none' }}
        />
      </Header>
      <Content style={{ padding: '48px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center', background: '#fafafa' }}>
        Hun Hiong Blog ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default BlogLayout;
