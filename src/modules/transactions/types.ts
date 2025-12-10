export interface FileMetadata {
  filename: string;
  fileType: string;
  uploadPath: string;
  uploadTimestamp: string;
}

export interface UploadResult {
  message: string;
  metadata: FileMetadata | Array<FileMetadata>;
}

export interface MultipartPart {
  headers: string;
  filename?: string;
  contentType?: string;
  content: Buffer;
}
