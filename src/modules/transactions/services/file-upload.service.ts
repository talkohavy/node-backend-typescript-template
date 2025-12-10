import type { Request } from 'express';
import type { WriteStream } from 'fs';
import { createWriteStream } from 'fs';
import { join } from 'path';
import type { FileMetadata, UploadResult } from '../types';
import { extractBoundary, parseMultipartHeaders } from '../utils';

export class FileUploadService {
  /**
   * Handles multipart form data file upload
   */
  async handleMultipartUpload(req: Request, boundary: string): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const bufferRef: { current: Buffer } = { current: Buffer.alloc(0) };
      const metadataArr: Array<FileMetadata> = [];
      const fileStreamRef: { current: WriteStream | null } = { current: null };

      req.on('data', (chunk) => {
        bufferRef.current = Buffer.concat([bufferRef.current, chunk]);
        this.processBuffer(bufferRef, boundary, metadataArr, fileStreamRef);
      });

      req.on('end', () => {
        fileStreamRef.current?.end();
        resolve({
          message: 'Files uploaded successfully',
          metadata: metadataArr,
        });
      });

      req.on('error', (err) => {
        fileStreamRef.current?.end();
        reject(err);
      });
    });
  }

  /**
   * Handles binary file upload
   */
  async handleBinaryUpload(req: Request, contentType: string): Promise<UploadResult> {
    const filename = (req.headers['x-filename'] as string) || 'uploaded-file';
    const filePath = join(process.cwd(), filename);

    const metadata: FileMetadata = {
      filename,
      fileType: contentType,
      uploadPath: filePath,
      uploadTimestamp: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);

      req.pipe(writeStream);

      writeStream.on('finish', () => {
        resolve({
          message: 'File uploaded successfully',
          metadata,
        });
      });

      writeStream.on('error', reject);
    });
  }

  /**
   * Determines upload type and routes to appropriate handler
   */
  async uploadFile(req: Request): Promise<UploadResult> {
    const contentType = req.headers['content-type'];

    if (!contentType) throw new Error('Missing content-type header');

    if (contentType.startsWith('multipart/form-data')) {
      const boundary = extractBoundary(contentType);

      if (!boundary) throw new Error('Invalid multipart/form-data content-type header! boundary missing.');

      return this.handleMultipartUpload(req, boundary);
    }

    return this.handleBinaryUpload(req, contentType);
  }

  /**
   * Processes the buffer to extract multipart data
   */
  private processBuffer(
    bufferRef: { current: Buffer },
    boundary: string,
    metadataArr: Array<FileMetadata>,
    fileStreamRef: { current: WriteStream | null },
  ): void {
    let remainingBuffer = bufferRef.current;

    while (true) {
      const boundaryIndex = remainingBuffer.indexOf(`--${boundary}`);
      if (boundaryIndex === -1) break;

      const partEndIndex = remainingBuffer.indexOf('\r\n\r\n', boundaryIndex);
      if (partEndIndex === -1) break;

      const headers = remainingBuffer.subarray(boundaryIndex, partEndIndex).toString();
      const parsedHeaders = parseMultipartHeaders(headers);

      if (parsedHeaders.filename) {
        fileStreamRef.current?.end();

        const filePath = join(process.cwd(), parsedHeaders.filename);
        fileStreamRef.current = createWriteStream(filePath);
        const currentMetadata: FileMetadata = {
          filename: parsedHeaders.filename,
          fileType: parsedHeaders.contentType || 'unknown',
          uploadPath: filePath,
          uploadTimestamp: new Date().toISOString(),
        };

        metadataArr.push(currentMetadata);
      }

      const contentStartIndex = partEndIndex + 4;
      const nextBoundaryIndex = remainingBuffer.indexOf(`--${boundary}`, contentStartIndex);

      if (nextBoundaryIndex !== -1) {
        const fileContent = remainingBuffer.subarray(contentStartIndex, nextBoundaryIndex - 2);
        fileStreamRef.current?.write(fileContent);
        remainingBuffer = remainingBuffer.subarray(nextBoundaryIndex);
      } else {
        remainingBuffer = remainingBuffer.subarray(contentStartIndex);
        break;
      }
    }

    bufferRef.current = remainingBuffer;
  }
}
