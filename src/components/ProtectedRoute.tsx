import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { USER_ROLE } from '@/utils/constants';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // 未登录，重定向到首页
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 非管理员角色，重定向到首页
  if (user?.role !== USER_ROLE.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
