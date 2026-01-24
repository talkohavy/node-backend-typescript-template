import { API_URLS } from '../../../common/constants';
import type { Application, NextFunction, Request, Response } from 'express';

export class BooksMiddleware {
  public constructor(private readonly app: Application) {}

  public use() {
    this.app.use(API_URLS.books, (_req: Request, _res: Response, next: NextFunction) => {
      console.log('Books middleware');

      next();
    });
  }
}
