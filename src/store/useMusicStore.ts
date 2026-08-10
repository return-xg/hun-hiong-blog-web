import { create } from 'zustand';
import { getMusicList } from '@/api/music';
import { audioManager } from '@/utils/audioManager';
import type { Music } from '@/types/music';

/** 默认音量 */
const DEFAULT_VOLUME = 0.7;

interface MusicState {
  /** 歌曲列表 */
  musicList: Music[];
  /** 当前播放歌曲 */
  currentMusic: Music | null;
  /** 当前播放索引 */
  currentIndex: number;
  /** 是否正在播放 */
  isPlaying: boolean;
  /** 当前播放时间（秒） */
  currentTime: number;
  /** 总时长（秒） */
  duration: number;
  /** 音量（0-1） */
  volume: number;
  /** 歌曲列表面板是否展开 */
  listOpen: boolean;

  /** 加载歌曲列表 */
  loadMusicList: () => Promise<void>;
  /** 播放指定索引的歌曲 */
  playMusic: (index: number) => Promise<void>;
  /** 暂停 */
  pauseMusic: () => void;
  /** 继续播放 */
  resumeMusic: () => void;
  /** 切换播放/暂停 */
  togglePlay: () => void;
  /** 下一首 */
  nextMusic: () => void;
  /** 上一首 */
  prevMusic: () => void;
  /** 设置播放进度（秒） */
  seekMusic: (time: number) => void;
  /** 设置音量（0-1） */
  setVolume: (value: number) => void;
  /** 切换歌曲列表面板 */
  toggleList: () => void;
  /** 同步 audioManager 的状态到 store */
  syncFromAudio: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  musicList: [],
  currentMusic: null,
  currentIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: DEFAULT_VOLUME,
  listOpen: false,

  loadMusicList: async () => {
    try {
      const result = await getMusicList();
      if (result.code === 0 && result.data.length > 0) {
        set({ musicList: result.data });
        // 尝试直接播放第一首
        get().playMusic(0);

        // 浏览器可能阻止无用户交互的自动播放，监听首次交互后补播
        const tryResume = () => {
          const { isPlaying, currentMusic } = get();
          if (currentMusic && !isPlaying) {
            get().resumeMusic();
          }
          window.removeEventListener('click', tryResume);
          window.removeEventListener('keydown', tryResume);
          window.removeEventListener('touchstart', tryResume);
        };
        window.addEventListener('click', tryResume, { once: false });
        window.addEventListener('keydown', tryResume, { once: false });
        window.addEventListener('touchstart', tryResume, { once: false });
      }
    } catch {
      // 加载失败由拦截器统一处理
    }
  },

  playMusic: async (index) => {
    const { musicList } = get();
    if (index < 0 || index >= musicList.length) return;
    const music = musicList[index];
    // 先更新状态，再加载并播放音频
    set({
      currentMusic: music,
      currentIndex: index,
      isPlaying: true,
      duration: music.duration,
    });
    await audioManager.play(music.url);
    audioManager.setVolume(get().volume);
  },

  pauseMusic: () => {
    audioManager.pause();
    set({ isPlaying: false });
  },

  resumeMusic: () => {
    audioManager.resume();
    set({ isPlaying: true });
  },

  togglePlay: () => {
    const { isPlaying, currentMusic } = get();
    if (!currentMusic) {
      // 没有歌曲时，从第一首开始播放
      get().playMusic(0);
      return;
    }
    if (isPlaying) {
      get().pauseMusic();
    } else {
      get().resumeMusic();
    }
  },

  nextMusic: () => {
    const { currentIndex, musicList } = get();
    if (musicList.length === 0) return;
    const nextIndex = (currentIndex + 1) % musicList.length;
    get().playMusic(nextIndex);
  },

  prevMusic: () => {
    const { currentIndex, musicList } = get();
    if (musicList.length === 0) return;
    const prevIndex = (currentIndex - 1 + musicList.length) % musicList.length;
    get().playMusic(prevIndex);
  },

  seekMusic: (time) => {
    audioManager.seek(time);
    set({ currentTime: time });
  },

  setVolume: (value) => {
    audioManager.setVolume(value);
    set({ volume: value });
  },

  toggleList: () => {
    set((state) => ({ listOpen: !state.listOpen }));
  },

  syncFromAudio: () => {
    set({
      currentTime: audioManager.currentTime,
      duration: audioManager.duration,
      isPlaying: audioManager.isPlaying,
    });
  },
}));
