import type { Application } from 'express';
import { BooksController } from './controllers/books.controller';
import { BooksMiddleware } from './middleware/books.middleware';
import { BooksService } from './services/books.service';

export class BooksModule {
  private static instance: BooksModule;
  private booksService!: BooksService;

  static getInstance(app?: any): BooksModule {
    if (!BooksModule.instance) {
      BooksModule.instance = new BooksModule(app);
    }
    return BooksModule.instance;
  }

  private constructor(private readonly app: any) {
    this.initializeModule();
  }

  private initializeModule(): void {
    this.booksService = new BooksService();

    this.attachController(this.app);
  }

  private attachController(app: Application): void {
    const booksController = new BooksController(app, this.booksService);
    const booksMiddleware = new BooksMiddleware(app);

    booksMiddleware.use();

    booksController.attachRoutes();
  }

  getBooksService(): BooksService {
    return this.booksService;
  }
}
