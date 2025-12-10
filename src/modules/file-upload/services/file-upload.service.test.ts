import type { Request } from 'express';
import { createWriteStream } from 'fs';
import { Readable, Writable } from 'stream';
import {
  extractBoundary as extractBoundaryToMock,
  parseMultipartHeaders as parseMultipartHeadersToMock,
} from '../utils';
import { FileUploadService } from './file-upload.service';

jest.mock('fs', () => ({
  createWriteStream: jest.fn(),
}));

jest.mock('../utils', () => ({
  extractBoundary: jest.fn(),
  parseMultipartHeaders: jest.fn(),
}));

const mockCreateWriteStream = createWriteStream as jest.MockedFunction<typeof createWriteStream>;
const extractBoundary = extractBoundaryToMock as jest.MockedFunction<typeof extractBoundaryToMock>;
const parseMultipartHeaders = parseMultipartHeadersToMock as jest.MockedFunction<typeof parseMultipartHeadersToMock>;

function createMockRequest(headers: Record<string, string>, data: string | Buffer): Partial<Request> {
  const readable = new Readable();
  readable.push(data);
  readable.push(null);

  return {
    headers,
    pipe: jest.fn((stream) => {
      readable.pipe(stream);
      return stream;
    }),
    on: jest.fn((event, handler) => {
      readable.on(event, handler);
      return readable;
    }),
  } as any;
}

function createMockWriteStream() {
  const mockStream = new Writable({
    write(_chunk, _encodingg, callback) {
      callback();
    },
  });

  const writeSpy = jest.fn();
  const endSpy = jest.fn((cb) => {
    if (cb) cb();
    mockStream.emit('finish');
  });

  mockStream.write = writeSpy;
  mockStream.end = endSpy as any;

  return mockStream;
}

describe('FileUploadService', () => {
  let service: FileUploadService;

  beforeEach(() => {
    service = new FileUploadService();
    jest.clearAllMocks();
  });

  describe('handleBinaryUpload', () => {
    it('should successfully upload a file with valid content-type', async () => {
      const mockStream = createMockWriteStream();
      mockCreateWriteStream.mockReturnValue(mockStream as any);

      const req = createMockRequest(
        {
          'content-type': 'application/pdf',
          'x-filename': 'test.pdf',
        },
        'test file content',
      );

      const result = await service.handleBinaryUpload(req as Request);

      expect(result.message).toBe('File uploaded successfully');
      expect(result.metadata).toMatchObject({
        filename: 'test.pdf',
        fileType: 'application/pdf',
      });
      expect(mockCreateWriteStream).toHaveBeenCalled();
    });

    it('should use default filename when x-filename header is missing', async () => {
      const mockStream = createMockWriteStream();
      mockCreateWriteStream.mockReturnValue(mockStream as any);

      const req = createMockRequest(
        {
          'content-type': 'application/pdf',
        },
        'test file content',
      );

      const result = await service.handleBinaryUpload(req as Request);

      expect(result.metadata).toMatchObject({
        filename: 'uploaded-file',
        fileType: 'application/pdf',
      });
    });

    it('should throw error when content-type header is missing', async () => {
      const req = createMockRequest({}, 'test file content');

      await expect(service.handleBinaryUpload(req as Request)).rejects.toThrow('Missing content-type header');
    });

    it('should throw error for disallowed content-type', async () => {
      const req = createMockRequest(
        {
          'content-type': 'application/x-executable',
        },
        'test file content',
      );

      await expect(service.handleBinaryUpload(req as Request)).rejects.toThrow('is not allowed');
    });
  });

  describe('handleMultipartUpload', () => {
    it('should successfully upload a single file', async () => {
      const mockStream = createMockWriteStream();
      mockCreateWriteStream.mockReturnValue(mockStream as any);

      extractBoundary.mockReturnValue('boundary123');
      parseMultipartHeaders.mockReturnValue({
        filename: 'document.pdf',
        contentType: 'application/pdf',
      });

      const multipartData = Buffer.from(
        '--boundary123\r\n' +
          'Content-Disposition: form-data; name="file"; filename="document.pdf"\r\n' +
          'Content-Type: application/pdf\r\n' +
          '\r\n' +
          'PDF content here\r\n' +
          '--boundary123--',
      );

      const req = createMockRequest(
        {
          'content-type': 'multipart/form-data; boundary=boundary123',
        },
        multipartData,
      );

      const result = await service.handleMultipartUpload(req as Request);

      expect(result.message).toBe('Files uploaded successfully');
      expect(Array.isArray(result.metadata)).toBe(true);
      expect(mockStream.write).toHaveBeenCalled();
      expect(mockStream.end).toHaveBeenCalled();
    });

    it('should throw error when content-type is not multipart/form-data', async () => {
      const req = createMockRequest(
        {
          'content-type': 'application/json',
        },
        'test data',
      );

      await expect(service.handleMultipartUpload(req as Request)).rejects.toThrow('Missing content-type header');
    });

    it('should throw error when boundary is missing', async () => {
      extractBoundary.mockReturnValue(null);

      const req = createMockRequest(
        {
          'content-type': 'multipart/form-data',
        },
        'test data',
      );

      await expect(service.handleMultipartUpload(req as Request)).rejects.toThrow('boundary missing');
    });
  });
});
