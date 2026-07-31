import { create } from 'zustand';
import { storage } from '@/utils/storage';
import { getCurrentUser } from '@/api/auth';
import type { AuthUser } from '@/types/auth';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  /** 登录：存储 Token 并可选设置用户 */
  login: (token: string, user?: AuthUser | null) => void;
  /** 刷新 Token 后更新所有凭证 */
  refreshAuth: (accessToken: string, refreshToken: string, user?: AuthUser | null) => void;
  /** 初始化用户信息（页面刷新后从接口恢复） */
  initUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: storage.getToken(),
  user: null,
  isAuthenticated: !!storage.getToken(),

  setToken: (token) => {
    if (token) {
      storage.setToken(token);
    } else {
      storage.removeToken();
    }
    set({ token, isAuthenticated: !!token });
  },

  setUser: (user) => {
    set({ user });
  },

  login: (token, user) => {
    storage.setToken(token);
    set({
      token,
      user: user ?? null,
      isAuthenticated: true,
    });
  },

  refreshAuth: (accessToken, refreshTokenValue, user) => {
    storage.setToken(accessToken);
    storage.setRefreshToken(refreshTokenValue);
    set({
      token: accessToken,
      user: user ?? null,
      isAuthenticated: true,
    });
  },

  initUser: async () => {
    try {
      const result = await getCurrentUser();
      if (result.code === 0) {
        set({ user: result.data });
      }
    } catch {
      // 获取用户信息失败，保持当前状态
    }
  },

  logout: () => {
    storage.clear();
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
