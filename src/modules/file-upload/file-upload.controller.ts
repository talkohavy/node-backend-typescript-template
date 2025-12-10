import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '../../lib/lucky-server';
import type { FileUploadService } from './services/file-upload.service';
import { API_URLS, StatusCodes } from '../../common/constants';
import { logger } from '../../core';

export class FileUploadController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly fileUploadService: FileUploadService,
  ) {}

  private uploadFileMultipart() {
    this.app.post(API_URLS.uploadFileMultipart, async (req: Request, res: Response) => {
      logger.info(`POST ${API_URLS.uploadFileMultipart} - uploading file`);

      const result = await this.fileUploadService.handleMultipartUpload(req);

      res.status(StatusCodes.OK).json(result);
    });
  }

  private uploadFileBinary() {
    this.app.post(API_URLS.uploadFileBinary, async (req: Request, res: Response) => {
      logger.info(`POST ${API_URLS.uploadFileBinary} - uploading file`);

      const result = await this.fileUploadService.handleBinaryUpload(req);

      res.status(StatusCodes.OK).json(result);
    });
  }

  attachRoutes() {
    this.uploadFileMultipart();
    this.uploadFileBinary();
  }
}
