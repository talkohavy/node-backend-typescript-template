import { Application, NextFunction, Request, Response } from 'express';

export class BooksMiddleware {
  public constructor() {}

  public use(app: Application): void {
    app.use('/books', (_req: Request, _res: Response, next: NextFunction): void => {
      console.log('Books middleware');

      next();
    });
  }
}
