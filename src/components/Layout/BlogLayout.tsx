import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Avatar, Space } from 'antd';
import {
  HomeOutlined,
  InfoCircleOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { USER_ROLE, getFileUrl } from '@/utils/constants';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';

const { Header, Content, Footer } = Layout;

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
  { key: '/about', icon: <InfoCircleOutlined />, label: <Link to="/about">关于</Link> },
];

const BlogLayout: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { openLoginModal } = useAppStore();

  /** 退出登录 */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /** 已登录时的下拉菜单 */
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    ...(user?.role === USER_ROLE.ADMIN
      ? [
          {
            key: 'admin',
            icon: <SettingOutlined />,
            label: '后台管理',
            onClick: () => navigate('/admin'),
          },
          { type: 'divider' as const },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* 顶部导航 */}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid var(--border-light)',
          padding: '0 48px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 'var(--header-height)',
          lineHeight: 'var(--header-height)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            fontFamily: 'var(--font-serif)',
            color: 'var(--primary-color)',
            marginRight: 48,
            cursor: 'pointer',
            letterSpacing: 0.5,
            whiteSpace: 'nowrap',
          }}
          onClick={() => navigate('/')}
        >
          Hun Hiong Blog
        </div>

        {/* 导航菜单 */}
        <Menu
          mode="horizontal"
          items={menuItems}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: 15,
          }}
        />

        {/* 右侧用户区 */}
        <div>
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space
                style={{
                  cursor: 'pointer',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-button)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Avatar
                  size={32}
                  src={getFileUrl(user?.avatar)}
                  icon={<UserOutlined />}
                  style={{ border: '2px solid var(--primary-light)' }}
                />
                <span style={{ color: 'var(--text-color)', fontSize: 14 }}>
                  {user?.nickname ?? user?.username ?? '用户'}
                </span>
              </Space>
            </Dropdown>
          ) : (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={openLoginModal}
              shape="round"
              size="middle"
            >
              登录
            </Button>
          )}
        </div>
      </Header>

      {/* 主体内容 */}
      <Content
        style={{
          padding: '40px 48px',
          maxWidth: 'var(--content-max-width)',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Outlet />
      </Content>

      {/* 页脚 */}
      <Footer
        style={{
          textAlign: 'center',
          background: 'var(--bg-component)',
          borderTop: '1px solid var(--border-light)',
          padding: '32px 48px',
        }}
      >
        <div style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-secondary)', fontSize: 14 }}>
          <div style={{ marginBottom: 8, fontSize: 16, color: 'var(--primary-color)', fontWeight: 600 }}>
            Hun Hiong Blog
          </div>
          <div>
            ©{new Date().getFullYear()} · 记录技术与生活的点滴
          </div>
        </div>
      </Footer>

      {/* 登录/注册弹窗 */}
      <LoginModal />
      <RegisterModal />
    </Layout>
  );
};

export default BlogLayout;
