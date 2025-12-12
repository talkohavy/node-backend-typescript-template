import type { ServerApp } from '../../common/types';
import { BooksController } from './controllers/books.controller';
import { BooksMiddleware } from './middleware/books.middleware';
import { BooksService } from './services/books.service';

export class BooksModule {
  private booksService!: BooksService;

  constructor(private readonly app: any) {
    this.initializeModule();
  }

  private initializeModule(): void {
    this.booksService = new BooksService();

    this.attachController(this.app);
  }

  private attachController(app: ServerApp): void {
    const booksController = new BooksController(app, this.booksService);
    const booksMiddleware = new BooksMiddleware(app);

    booksMiddleware.use();

    booksController.registerRoutes();
  }

  getBooksService(): BooksService {
    return this.booksService;
  }
}
