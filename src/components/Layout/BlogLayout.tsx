import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Avatar, Space } from 'antd';
import {
  HomeOutlined,
  InfoCircleOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuthStore } from '@/store/useAuthStore';

const { Header, Content, Footer } = Layout;

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
  { key: '/about', icon: <InfoCircleOutlined />, label: <Link to="/about">关于</Link> },
];

const BlogLayout: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  /** 退出登录 */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /** 已登录时的下拉菜单 */
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'admin',
      icon: <SettingOutlined />,
      label: '后台管理',
      onClick: () => navigate('/admin'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

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
        <div>
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  size="small"
                  src={user?.avatar}
                  icon={<UserOutlined />}
                />
                <span>{user?.nickname ?? user?.username ?? '用户'}</span>
              </Space>
            </Dropdown>
          ) : (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
            >
              登录
            </Button>
          )}
        </div>
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
