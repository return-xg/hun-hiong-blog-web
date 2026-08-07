import { useMusicStore } from '@/store/useMusicStore';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';

/** 格式化时间：秒 → mm:ss */
function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '00:00';
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/** 播放列表面板 */
interface MusicListProps {
  /** 是否向左弹出（空间足够时向左，否则向右） */
  flipLeft: boolean;
}

const MusicList: React.FC<MusicListProps> = ({ flipLeft }) => {
  const { musicList, currentIndex, isPlaying, playMusic, togglePlay } = useMusicStore();

  /** 点击歌曲 */
  const handleSelect = (index: number) => {
    if (index === currentIndex) {
      togglePlay();
    } else {
      playMusic(index);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        ...(flipLeft
          ? { right: '100%', marginRight: 8 }
          : { left: '100%', marginLeft: 8 }),
        background: 'var(--bg-component)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-float)',
        border: '1px solid var(--border-light)',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        maxHeight: 320,
      }}
    >
      {/* 标题栏 */}
      <div
        style={{
          padding: '10px 14px 8px',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-color)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span>播放列表</span>
        <span style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 400 }}>
          {musicList.length} 首
        </span>
      </div>

      {/* 歌曲列表 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {musicList.length === 0 && (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-light)', fontSize: 12 }}>
            暂无歌曲
          </div>
        )}
        {musicList.map((music, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={music.id}
              onClick={() => handleSelect(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 14px',
                cursor: 'pointer',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                transition: 'background 0.15s',
                gap: 8,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--bg-secondary)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              {/* 序号 / 播放状态 */}
              <div style={{ width: 18, textAlign: 'center', flexShrink: 0 }}>
                {isActive && isPlaying ? (
                  <PauseCircleOutlined style={{ fontSize: 13, color: 'var(--primary-color)' }} />
                ) : isActive ? (
                  <PlayCircleOutlined style={{ fontSize: 13, color: 'var(--primary-color)' }} />
                ) : (
                  <span style={{ fontSize: 11, color: 'var(--text-light)' }}>{index + 1}</span>
                )}
              </div>

              {/* 歌曲信息 */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--primary-color)' : 'var(--text-color)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {music.title}
                  {music.artist && (
                    <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>
                      {' - '}{music.artist}
                    </span>
                  )}
                </div>
              </div>

              {/* 时长 */}
              <span style={{ fontSize: 10, color: 'var(--text-light)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(music.duration)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MusicList;
