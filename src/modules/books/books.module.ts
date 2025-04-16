import { Application } from 'express';
import { BooksController } from './books.controller.js';
import { BooksMiddleware } from './books.middleware.js';
import { BooksService } from './books.service.js';

export function attachBooksModule(app: Application) {
  const service = new BooksService();
  const controller = new BooksController(app, service);
  const middleware = new BooksMiddleware();

  middleware.use(app);

  controller.attachRoutes();
}
