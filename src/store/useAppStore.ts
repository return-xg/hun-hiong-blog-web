import { create } from 'zustand';

interface AppState {
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean;
  /** 全局 loading */
  loading: boolean;
  /** 登录弹窗是否显示 */
  loginModalOpen: boolean;
  /** 注册弹窗是否显示 */
  registerModalOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setLoading: (loading: boolean) => void;
  /** 打开登录弹窗 */
  openLoginModal: () => void;
  /** 关闭登录弹窗 */
  closeLoginModal: () => void;
  /** 打开注册弹窗 */
  openRegisterModal: () => void;
  /** 关闭注册弹窗 */
  closeRegisterModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  loading: false,
  loginModalOpen: false,
  registerModalOpen: false,

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  openLoginModal: () => {
    set({ loginModalOpen: true });
  },

  closeLoginModal: () => {
    set({ loginModalOpen: false });
  },

  openRegisterModal: () => {
    set({ registerModalOpen: true });
  },

  closeRegisterModal: () => {
    set({ registerModalOpen: false });
  },
}));
