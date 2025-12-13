import express from 'express';
import request from 'supertest';
import type { ConfiguredExpress } from '../../common/types';
import type { FileUploadService } from './services/file-upload.service';
import { API_URLS, StatusCodes } from '../../common/constants';
import { FileUploadController } from './file-upload.controller';

describe('FileUploadController', () => {
  let app: ConfiguredExpress;
  let mockFileUploadService: jest.Mocked<FileUploadService>;

  beforeEach(() => {
    app = express() as ConfiguredExpress;

    app.logger = {
      info: jest.fn(),
    } as any;

    mockFileUploadService = {
      handleMultipartUpload: jest.fn(),
      handleBinaryUpload: jest.fn(),
    } as any;

    const controller = new FileUploadController(app, mockFileUploadService);
    controller.registerRoutes();
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
      expect(app.logger.info).toHaveBeenCalledWith(`POST ${API_URLS.uploadFileMultipart} - uploading file`);
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
      expect(app.logger.info).toHaveBeenCalledWith(`POST ${API_URLS.uploadFileBinary} - uploading file`);
    });
  });
});
