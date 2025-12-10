import type { Request } from 'express';
import type { WriteStream } from 'fs';
import { createWriteStream } from 'fs';
import { join } from 'path';
import type { FileMetadata, UploadResult } from '../types';
import { extractBoundary, parseMultipartHeaders } from '../utils';

export class FileUploadService {
  async handleBinaryUpload(req: Request): Promise<UploadResult> {
    const contentType = req.headers['content-type'] || '';

    if (!contentType) throw new Error('Missing content-type header');

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
   * Handles multipart form data file upload
   *
   * HOW IT WORKS:
   * Multipart form data arrives as a stream of chunks over the network. Each chunk contains
   * binary data that may include parts of file headers, file content, or boundary markers.
   * Since chunks can arrive at arbitrary positions (e.g., a boundary marker could be split
   * across multiple chunks), we need to accumulate data in a buffer until we have enough
   * to parse complete parts.
   *
   * WHY USE A BUFFER:
   * - Network data arrives in unpredictable chunk sizes
   * - A single chunk might contain partial boundary markers or incomplete headers
   * - We need to accumulate data until we can identify complete multipart parts
   * - The buffer stores unprocessed data between chunks
   *
   * WHAT HAPPENS:
   * 1. Each 'data' event adds new chunk to buffer (concatenation)
   * 2. We scan buffer for boundary markers (--{boundary})
   * 3. When found, we extract headers (Content-Disposition, Content-Type) between
   *    the boundary and \r\n\r\n marker
   * 4. We create a write stream for the file and store its metadata
   * 5. We extract file content between current boundary and next boundary
   * 6. We write content to file stream and remove processed data from buffer
   * 7. Repeat until no more complete parts can be extracted
   * 8. Any remaining partial data stays in buffer for next chunk
   * 9. On 'end' event, close all streams and return metadata
   *
   * @param req - Express request object (readable stream)
   * @returns Promise resolving to upload result with file metadata
   */
  async handleMultipartUpload(req: Request): Promise<UploadResult> {
    const contentType = req.headers['content-type'] || '';

    if (!contentType.startsWith('multipart/form-data')) throw new Error('Missing content-type header');

    const boundary = extractBoundary(contentType);

    if (!boundary) throw new Error('Invalid multipart/form-data content-type header! boundary missing.');

    return new Promise((resolve, reject) => {
      const bufferRef: { current: Buffer } = { current: Buffer.alloc(0) };
      const metadataArr: Array<FileMetadata> = [];
      const fileStreamRef: { current: WriteStream | null } = { current: null };

      req.on('data', (chunk) => {
        bufferRef.current = Buffer.concat([bufferRef.current, chunk]);
        this.processMultipartBuffer(bufferRef, boundary, metadataArr, fileStreamRef);
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
   * Processes the buffer to extract multipart data
   */
  private processMultipartBuffer(
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
