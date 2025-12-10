import express from 'express';
import request from 'supertest';
import type { FileUploadService } from './services/file-upload.service';
import { API_URLS, StatusCodes } from '../../common/constants';
import { logger } from '../../core';
import { FileUploadController } from './file-upload.controller';

jest.mock('../../core', () => ({
  logger: {
    info: jest.fn(),
  },
}));

const mockLogger = logger as jest.Mocked<typeof logger>;

describe('FileUploadController', () => {
  let app: express.Application;
  let mockFileUploadService: jest.Mocked<FileUploadService>;

  beforeEach(() => {
    app = express();

    mockFileUploadService = {
      handleMultipartUpload: jest.fn(),
      handleBinaryUpload: jest.fn(),
    } as any;

    const controller = new FileUploadController(app, mockFileUploadService);
    controller.attachRoutes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadFileMultipart', () => {
    it('should upload file using multipart and return success', async () => {
      const mockResult = {
        message: 'Files uploaded successfully',
        metadata: [
          { filename: 'test.pdf', fileType: 'application/pdf', uploadPath: '/path', uploadTimestamp: '2025-12-10' },
        ],
      };

      mockFileUploadService.handleMultipartUpload.mockResolvedValue(mockResult);

      const response = await request(app)
        .post(API_URLS.uploadFileMultipart)
        .set('Content-Type', 'multipart/form-data; boundary=test');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockResult);
      expect(mockFileUploadService.handleMultipartUpload).toHaveBeenCalledWith(expect.any(Object));
      expect(mockLogger.info).toHaveBeenCalledWith(`POST ${API_URLS.uploadFileMultipart} - uploading file`);
    });
  });

  describe('uploadFileBinary', () => {
    it('should upload file using binary and return success', async () => {
      const mockResult = {
        message: 'File uploaded successfully',
        metadata: {
          filename: 'test.pdf',
          fileType: 'application/pdf',
          uploadPath: '/path',
          uploadTimestamp: '2025-12-10',
        },
      };

      mockFileUploadService.handleBinaryUpload.mockResolvedValue(mockResult);

      const response = await request(app)
        .post(API_URLS.uploadFileBinary)
        .set('Content-Type', 'application/pdf')
        .send('binary data');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockResult);
      expect(mockFileUploadService.handleBinaryUpload).toHaveBeenCalledWith(expect.any(Object));
      expect(mockLogger.info).toHaveBeenCalledWith(`POST ${API_URLS.uploadFileBinary} - uploading file`);
    });
  });
});
