import { Application } from 'express';
import { BooksController } from './controllers/books.controller';
import { BooksMiddleware } from './middleware/books.middleware';
import { BooksService } from './services/books.service';

class BooksModule {
  private static instance: BooksModule;
  private booksService!: BooksService;

  private constructor() {
    this.initializeModule();
  }

  static getInstance(): BooksModule {
    if (!BooksModule.instance) {
      BooksModule.instance = new BooksModule();
    }
    return BooksModule.instance;
  }

  protected initializeModule(): void {
    this.booksService = new BooksService();
  }

  attachController(app: Application): void {
    const booksController = new BooksController(app, this.booksService);
    const booksMiddleware = new BooksMiddleware(app);

    booksMiddleware.use();

    booksController.attachRoutes();
  }

  getBooksService(): BooksService {
    return this.booksService;
  }
}

export function getBooksModule(): BooksModule {
  return BooksModule.getInstance();
}
