/** 歌曲信息 */
export interface Music {
  id: number;
  /** 歌曲名称 */
  title: string;
  /** 歌手 */
  artist: string;
  /** 封面图片路径 */
  cover: string;
  /** 音频文件路径 */
  url: string;
  /** 时长（秒） */
  duration: number;
  /** 状态：0-禁用，1-启用 */
  status: number;
  /** 排序值 */
  sort: number;
}

/** 音乐分页查询参数 */
export interface MusicQuery {
  current?: number;
  size?: number;
  /** 歌曲名称（模糊搜索） */
  title?: string;
  /** 歌手（模糊搜索） */
  artist?: string;
  /** 状态过滤 */
  status?: number;
}

/** 音乐编辑表单（所有字段可选） */
export interface MusicEditForm {
  /** 歌曲名称 */
  title?: string;
  /** 歌手 */
  artist?: string;
  /** 封面地址 */
  cover?: string;
  /** 时长（秒） */
  duration?: number;
  /** 排序值 */
  sort?: number;
  /** 状态：0-禁用，1-启用 */
  status?: number;
}
