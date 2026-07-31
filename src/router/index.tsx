import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/Layout/AdminLayout';
import BlogLayout from '@/components/Layout/BlogLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

// 页面组件
import Dashboard from '@/pages/admin/Dashboard';
import ArticleList from '@/pages/admin/ArticleList';
import ArticleEdit from '@/pages/admin/ArticleEdit';
import CategoryList from '@/pages/admin/CategoryList';
import TagList from '@/pages/admin/TagList';
import UserList from '@/pages/admin/UserList';
import Home from '@/pages/blog/Home';
import ArticleDetail from '@/pages/blog/ArticleDetail';
import CategoryPage from '@/pages/blog/CategoryPage';
import TagPage from '@/pages/blog/TagPage';
import About from '@/pages/blog/About';
import Profile from '@/pages/blog/Profile';

const router = createBrowserRouter([
  // 前台博客路由
  {
    path: '/',
    element: <BlogLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'article/:id', element: <ArticleDetail /> },
      { path: 'category/:id', element: <CategoryPage /> },
      { path: 'tag/:id', element: <TagPage /> },
      { path: 'about', element: <About /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  // 认证路由（登录/注册已改为弹窗形式，重定向到首页）
  { path: '/login', element: <Navigate to="/" replace /> },
  { path: '/register', element: <Navigate to="/" replace /> },
  // 后台管理路由
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'articles', element: <ArticleList /> },
      { path: 'articles/create', element: <ArticleEdit /> },
      { path: 'articles/edit/:id', element: <ArticleEdit /> },
      { path: 'categories', element: <CategoryList /> },
      { path: 'tags', element: <TagList /> },
      { path: 'users', element: <UserList /> },
    ],
  },
  // 兜底重定向
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;
