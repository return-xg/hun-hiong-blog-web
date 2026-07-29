import request from './request';
import type { Result } from '@/types/api';
import type { FileUploadResponse } from '@/types/file';

/** 上传文件 */
export function uploadFile(file: File): Promise<Result<FileUploadResponse>> {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
