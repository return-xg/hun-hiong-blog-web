import { create } from 'zustand';
import { getMusicPageList, batchDeleteMusic } from '@/api/music';
import type { Music, MusicQuery } from '@/types/music';

interface MusicManageState {
  /** 歌曲列表 */
  musicList: Music[];
  /** 是否加载中 */
  loading: boolean;
  /** 分页信息 */
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  /** 当前搜索条件 */
  query: MusicQuery;

  /** 加载分页列表 */
  fetchList: (page?: number, pageSize?: number) => Promise<void>;
  /** 设置搜索条件并查询 */
  setQuery: (query: MusicQuery) => void;
  /** 批量删除 */
  batchRemove: (ids: number[]) => Promise<void>;
}

export const useMusicManageStore = create<MusicManageState>((set, get) => ({
  musicList: [],
  loading: false,
  pagination: { current: 1, pageSize: 10, total: 0 },
  query: {},

  fetchList: async (page = 1, pageSize = 10) => {
    set({ loading: true });
    try {
      const { query } = get();
      const result = await getMusicPageList({ ...query, current: page, size: pageSize });
      if (result.code === 0) {
        const { current, size, total, records } = result.data;
        set({
          musicList: records,
          pagination: { current, pageSize: size, total },
        });
      }
    } finally {
      set({ loading: false });
    }
  },

  setQuery: (query) => {
    set({ query });
    get().fetchList(1, get().pagination.pageSize);
  },

  batchRemove: async (ids) => {
    await batchDeleteMusic(ids);
    const { pagination } = get();
    get().fetchList(pagination.current, pagination.pageSize);
  },
}));
