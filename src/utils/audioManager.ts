import { getFileUrl } from '@/utils/constants';
import { storage } from '@/utils/storage';

/** 播放状态变更回调 */
type StateChangeCallback = () => void;

/**
 * 单例 Audio 管理器
 * 整个网站共享一个 Audio 实例，统一管理播放、暂停、切歌、音量等操作
 */
class AudioManager {
  private audio: HTMLAudioElement;
  private listeners: Set<StateChangeCallback> = new Set();

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';

    // 绑定事件，触发时通知所有订阅者
    const events: Array<keyof HTMLMediaElementEventMap> = ['timeupdate', 'ended', 'play', 'pause', 'loadedmetadata'];
    events.forEach((event) => {
      this.audio.addEventListener(event, this.notify);
    });
  }

  /** 订阅状态变更 */
  subscribe(callback: StateChangeCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /** 通知所有订阅者 */
  private notify = () => {
    this.listeners.forEach((cb) => cb());
  };

  /** 当前正在使用的 blob URL（用于释放内存） */
  private currentBlobUrl: string | null = null;

  /** 播放指定歌曲（通过 fetch 携带 Token 加载音频，解决鉴权问题） */
  async play(url: string) {
    const fullUrl = getFileUrl(url) ?? url;

    // 如果已经是同一个 blob URL，无需重新加载
    if (this.audio.src === fullUrl) {
      this.audio.play().catch(() => {});
      return;
    }

    try {
      // 通过 fetch 携带 Token 下载音频
      const headers: Record<string, string> = {};
      const token = storage.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(fullUrl, { headers });
      if (!response.ok) {
        throw new Error(`音频加载失败: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // 释放上一次的 blob URL
      if (this.currentBlobUrl) {
        URL.revokeObjectURL(this.currentBlobUrl);
      }
      this.currentBlobUrl = blobUrl;

      this.audio.src = blobUrl;
      await this.audio.play();
    } catch {
      // 如果 fetch 失败（如 CORS 问题），回退到直接设置 src
      this.audio.src = fullUrl;
      this.audio.play().catch(() => {});
    }
  }

  /** 暂停 */
  pause() {
    this.audio.pause();
  }

  /** 预加载音频（加载到 blob 但不自动播放） */
  async preload(url: string) {
    const fullUrl = getFileUrl(url) ?? url;

    // 已加载同一音频则跳过
    if (this.audio.src === fullUrl || this.currentBlobUrl === fullUrl) {
      return;
    }

    try {
      const headers: Record<string, string> = {};
      const token = storage.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(fullUrl, { headers });
      if (!response.ok) {
        throw new Error(`音频加载失败: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      if (this.currentBlobUrl) {
        URL.revokeObjectURL(this.currentBlobUrl);
      }
      this.currentBlobUrl = blobUrl;
      this.audio.src = blobUrl;
    } catch {
      // CORS 等场景回退到直接设置 src
      this.audio.src = fullUrl;
    }
  }

  /** 继续播放 */
  resume() {
    this.audio.play().catch(() => {});
  }

  /** 设置播放进度（秒） */
  seek(time: number) {
    this.audio.currentTime = time;
  }

  /** 设置音量（0-1） */
  setVolume(value: number) {
    this.audio.volume = Math.max(0, Math.min(1, value));
  }

  /** 获取当前播放时间（秒） */
  get currentTime(): number {
    return this.audio.currentTime;
  }

  /** 获取总时长（秒） */
  get duration(): number {
    return this.audio.duration || 0;
  }

  /** 获取当前音量 */
  get volume(): number {
    return this.audio.volume;
  }

  /** 是否正在播放 */
  get isPlaying(): boolean {
    return !this.audio.paused;
  }

  /** 获取底层 Audio 元素（仅供极端场景使用） */
  getAudioElement(): HTMLAudioElement {
    return this.audio;
  }
}

/** 全局唯一实例 */
export const audioManager = new AudioManager();
