import { useEffect, useRef, useCallback, useState } from 'react';
import { Slider, Tooltip } from 'antd';
import {
  PlayCircleFilled,
  PauseCircleFilled,
  StepForwardFilled,
  StepBackwardFilled,
  SoundOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { audioManager } from '@/utils/audioManager';
import { useMusicStore } from '@/store/useMusicStore';
import { getFileUrl } from '@/utils/constants';
import MusicList from './MusicList';

/** 格式化时间：秒 → mm:ss */
function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '00:00';
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/** 播放器尺寸常量 */
const PLAYER_WIDTH = 220;
const PLAYER_HEIGHT = 248;
const DISC_SIZE = 110;

const MusicPlayer: React.FC = () => {
  const {
    currentMusic,
    isPlaying,
    currentTime,
    duration,
    volume,
    listOpen,
    togglePlay,
    nextMusic,
    prevMusic,
    seekMusic,
    setVolume,
    toggleList,
    syncFromAudio,
    loadMusicList,
    musicList,
  } = useMusicStore();

  // ========== 拖动状态 ==========
  const [position, setPosition] = useState({ x: -1, y: -1 });
  const dragState = useRef({ isDragging: false, startX: 0, startY: 0, originX: 0, originY: 0 });
  const playerRef = useRef<HTMLDivElement>(null);

  // 初始定位：右下角
  useEffect(() => {
    if (position.x === -1) {
      setPosition({
        x: window.innerWidth - PLAYER_WIDTH - 20,
        y: window.innerHeight - PLAYER_HEIGHT - 20,
      });
    }
  }, [position.x]);

  // ========== 拖动逻辑 ==========
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.ant-slider, [role="button"], a, svg')) return;

    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
    };
    e.preventDefault();
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.current.isDragging) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      const newX = Math.max(0, Math.min(window.innerWidth - PLAYER_WIDTH, dragState.current.originX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - PLAYER_HEIGHT, dragState.current.originY + dy));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      dragState.current.isDragging = false;
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // ========== 播放器业务逻辑 ==========

  useEffect(() => {
    if (musicList.length === 0) {
      loadMusicList();
    }
  }, [musicList.length, loadMusicList]);

  useEffect(() => {
    const unsub = audioManager.subscribe(syncFromAudio);
    return () => { unsub(); };
  }, [syncFromAudio]);

  const handleEnded = useCallback(() => {
    nextMusic();
  }, [nextMusic]);

  useEffect(() => {
    const audio = audioManager.getAudioElement();
    audio.addEventListener('ended', handleEnded);
    return () => { audio.removeEventListener('ended', handleEnded); };
  }, [handleEnded]);

  const handleProgressChange = (value: number) => {
    seekMusic(value);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value / 100);
  };

  if (!currentMusic) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* 悬浮唱片播放器 */}
      <div
        ref={playerRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: PLAYER_WIDTH,
          zIndex: 1000,
          cursor: dragState.current.isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        {/* 歌曲列表面板：左侧空间够就向左弹，否则向右弹 */}
        {listOpen && <MusicList flipLeft={position.x > 280} />}

        {/* 播放器卡片 */}
        <div
          style={{
            background: 'var(--bg-component)',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-float)',
            padding: '16px 16px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {/* ===== 黑胶唱片 ===== */}
          <div style={{ position: 'relative', width: DISC_SIZE, height: DISC_SIZE }}>
            {/* 唱针 */}
            <div
              style={{
                position: 'absolute',
                top: -6,
                right: 12,
                width: 3,
                height: DISC_SIZE * 0.38,
                background: 'linear-gradient(to bottom, #bbb, #999)',
                borderRadius: 1.5,
                transformOrigin: 'top center',
                transform: `rotate(${isPlaying ? 20 : -8}deg)`,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
              }}
            >
              <div style={{
                position: 'absolute', top: -3, left: -3,
                width: 9, height: 9, borderRadius: '50%',
                background: '#ccc', border: '1.5px solid #aaa',
              }} />
            </div>

            {/* 唱片主体 */}
            <div
              style={{
                width: DISC_SIZE,
                height: DISC_SIZE,
                borderRadius: '50%',
                background: `radial-gradient(circle,
                  #2c2c2c 0%, #2c2c2c 20%,
                  #383838 20.5%, #2c2c2c 26%,
                  #383838 36%, #2c2c2c 42%,
                  #383838 52%, #2c2c2c 58%,
                  #383838 68%, #2c2c2c 74%,
                  #383838 84%, #2e2e2e 100%)`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.15), 0 0 0 2px var(--border-color)',
                animation: isPlaying ? 'vinyl-spin 4s linear infinite' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* 光泽 */}
              <div
                style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* 中心封面 */}
              <div
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  overflow: 'hidden', border: '2px solid #444',
                  flexShrink: 0, zIndex: 2,
                }}
              >
                {getFileUrl(currentMusic.cover) ? (
                  <img
                    src={getFileUrl(currentMusic.cover)}
                    alt={currentMusic.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%', height: '100%',
                      background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 16, fontWeight: 700,
                    }}
                  >
                    ♪
                  </div>
                )}
              </div>
            </div>

            {/* 进度弧线 */}
            {duration > 0 && (
              <svg
                width={DISC_SIZE} height={DISC_SIZE}
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
              >
                <circle
                  cx={DISC_SIZE / 2} cy={DISC_SIZE / 2} r={DISC_SIZE / 2 - 1}
                  fill="none" stroke="var(--primary-color)" strokeWidth={2}
                  strokeDasharray={`${(DISC_SIZE - 2) * Math.PI}`}
                  strokeDashoffset={`${(DISC_SIZE - 2) * Math.PI * (1 - progressPercent / 100)}`}
                  strokeLinecap="round" opacity={0.5}
                  transform={`rotate(-90 ${DISC_SIZE / 2} ${DISC_SIZE / 2})`}
                />
              </svg>
            )}
          </div>

          {/* ===== 歌曲信息 ===== */}
          <div style={{ width: '100%', textAlign: 'center', overflow: 'hidden' }}>
            <div
              style={{
                fontSize: 13, fontWeight: 600, color: 'var(--text-color)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              {currentMusic.title}
            </div>
            <div
              style={{
                fontSize: 11, color: 'var(--text-light)', marginTop: 1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              {currentMusic.artist}
            </div>
          </div>

          {/* ===== 进度条 ===== */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--text-light)', minWidth: 28, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(currentTime)}
            </span>
            <Slider
              min={0} max={duration || 100} step={0.1}
              value={currentTime} onChange={handleProgressChange}
              tooltip={{ formatter: (val) => formatTime(val ?? 0) }}
              styles={{
                track: { background: 'var(--primary-color)' },
                rail: { background: 'var(--border-color)' },
              }}
              style={{ flex: 1, margin: 0 }}
            />
            <span style={{ fontSize: 10, color: 'var(--text-light)', minWidth: 28, fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(duration)}
            </span>
          </div>

          {/* ===== 控制按钮 + 音量/列表 ===== */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* 播放控制 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <StepBackwardFilled
                onClick={prevMusic}
                style={{ fontSize: 14, color: 'var(--text-light)', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-light)'; }}
              />
              <div
                onClick={togglePlay}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--primary-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'transform 0.15s',
                  boxShadow: '0 2px 8px rgba(91, 164, 164, 0.3)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {isPlaying
                  ? <PauseCircleFilled style={{ fontSize: 18, color: '#fff' }} />
                  : <PlayCircleFilled style={{ fontSize: 18, color: '#fff' }} />
                }
              </div>
              <StepForwardFilled
                onClick={nextMusic}
                style={{ fontSize: 14, color: 'var(--text-light)', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-light)'; }}
              />
            </div>

            {/* 音量 + 列表 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Tooltip title={`音量 ${Math.round(volume * 100)}%`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <SoundOutlined style={{ fontSize: 12, color: 'var(--text-light)' }} />
                  <Slider
                    min={0} max={100}
                    value={Math.round(volume * 100)}
                    onChange={handleVolumeChange}
                    tooltip={{ formatter: (val) => `${val}%` }}
                    styles={{
                      track: { background: 'var(--primary-color)' },
                      rail: { background: 'var(--border-color)' },
                    }}
                    style={{ width: 48, margin: 0 }}
                  />
                </div>
              </Tooltip>
              <UnorderedListOutlined
                onClick={toggleList}
                style={{
                  fontSize: 14,
                  color: listOpen ? 'var(--primary-color)' : 'var(--text-light)',
                  cursor: 'pointer', transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { if (!listOpen) e.currentTarget.style.color = 'var(--text-secondary)'; }}
                onMouseLeave={(e) => { if (!listOpen) e.currentTarget.style.color = 'var(--text-light)'; }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 动画 */}
      <style>{`
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default MusicPlayer;
