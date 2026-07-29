/** 文件上传响应 */
export interface FileUploadResponse {
  id: number;
  originalName: string;
  url: string;
  fileType: string;
  fileSize: number;
}
