import request from './request';
import type { Result, PageResult } from '@/types/api';
import type { Music, MusicQuery, MusicEditForm } from '@/types/music';

/** 获取音乐列表（播放器用） */
export function getMusicList(): Promise<Result<Music[]>> {
  return request.get('/music/list');
}

/** 分页查询音乐（管理后台用） */
export function getMusicPageList(params?: MusicQuery): Promise<Result<PageResult<Music>>> {
  return request.get('/music/page', { params });
}

/** 查询音乐详情 */
export function getMusicDetail(id: number): Promise<Result<Music>> {
  return request.get(`/music/${id}`);
}

/** 上传音乐文件（multipart/form-data） */
export function uploadMusic(data: FormData): Promise<Result<Music>> {
  return request.post('/music/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/** 修改音乐信息 */
export function updateMusic(id: number, data: MusicEditForm): Promise<Result<void>> {
  return request.put(`/music/update/${id}`, data);
}

/** 批量删除音乐 */
export function batchDeleteMusic(ids: number[]): Promise<Result<void>> {
  return request.delete('/music/batch', { data: ids });
}
