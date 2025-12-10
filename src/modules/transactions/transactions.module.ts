import type { Application } from 'express';
import { FileUploadService } from './services/file-upload.service';
import { TransactionsController } from './transactions.controller';

export class TransactionsModule {
  private fileUploadService!: FileUploadService;

  constructor(private readonly app: any) {
    this.initializeModule();
  }

  private initializeModule(): void {
    this.fileUploadService = new FileUploadService();

    this.attachController(this.app);
  }

  private attachController(app: Application): void {
    const controller = new TransactionsController(app, this.fileUploadService);

    controller.attachRoutes();
  }
}
