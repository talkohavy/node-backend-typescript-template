import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '../../lib/lucky-server';
import type { FileUploadService } from './services/file-upload.service';
import { API_URLS, StatusCodes } from '../../common/constants';
import { logger } from '../../core';

export class TransactionsController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly fileUploadService: FileUploadService,
  ) {}

  private uploadFile() {
    this.app.post(API_URLS.uploadTransactionFile, async (req: Request, res: Response) => {
      logger.info(`POST ${API_URLS.uploadTransactionFile} - uploading file`);

      const result = await this.fileUploadService.uploadFile(req);

      res.status(StatusCodes.OK).json(result);
    });
  }

  attachRoutes() {
    this.uploadFile();
  }
}
