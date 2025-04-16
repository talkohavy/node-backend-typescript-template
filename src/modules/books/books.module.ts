import { Application } from 'express';
import { BooksController } from './books.controller';
import { BooksMiddleware } from './books.middleware';
import { BooksService } from './books.service';

export function attachBooksModule(app: Application) {
  const service = new BooksService();
  const controller = new BooksController(app, service);
  const middleware = new BooksMiddleware();

  middleware.use(app);

  controller.attachRoutes();
}
