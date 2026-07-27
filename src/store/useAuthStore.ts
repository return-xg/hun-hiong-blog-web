import { create } from 'zustand';
import { storage } from '@/utils/storage';
import type { AuthUser } from '@/types/auth';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  login: (accessToken: string, refreshToken: string, user: AuthUser) => void;
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

  login: (accessToken, refreshTokenValue, user) => {
    storage.setToken(accessToken);
    storage.setRefreshToken(refreshTokenValue);
    set({
      token: accessToken,
      user,
      isAuthenticated: true,
    });
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
