import type { UploadResult } from '../../../file-upload/types';
import type { Request } from 'express';

export interface IFileUploadAdapter {
  handleMultipartUpload(req: Request): Promise<UploadResult>;
  handleBinaryUpload(req: Request): Promise<UploadResult>;
}
