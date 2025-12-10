import type { Application } from 'express';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './services/file-upload.service';

export class FileUploadModule {
  private fileUploadService!: FileUploadService;

  constructor(private readonly app: any) {
    this.initializeModule();
  }

  private initializeModule(): void {
    this.fileUploadService = new FileUploadService();

    this.attachController(this.app);
  }

  private attachController(app: Application): void {
    const controller = new FileUploadController(app, this.fileUploadService);

    controller.attachRoutes();
  }
}
