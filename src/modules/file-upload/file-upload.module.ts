import type { Application } from 'express';
import { IS_STANDALONE_MICRO_SERVICES } from '../../common/constants';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './services/file-upload.service';

export class FileUploadModule {
  private fileUploadService!: FileUploadService;

  constructor(private readonly app: any) {
    this.initializeModule();
  }

  private initializeModule(): void {
    this.fileUploadService = new FileUploadService();

    // Only attach routes if running as a standalone micro-service
    if (IS_STANDALONE_MICRO_SERVICES) {
      this.attachRoutes(this.app);
    }
  }

  private attachRoutes(app: Application): void {
    const controller = new FileUploadController(app, this.fileUploadService);

    controller.registerRoutes();
  }

  get services() {
    return {
      fileUploadService: this.fileUploadService,
    };
  }
}
