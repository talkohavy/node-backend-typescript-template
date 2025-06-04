import { Application, NextFunction, Request, Response } from 'express';

export class BooksMiddleware {
  app: Application;

  public constructor(app: Application) {
    this.app = app;
  }

  public use(): void {
    this.app.use('/books', (_req: Request, _res: Response, next: NextFunction): void => {
      console.log('Books middleware');

      next();
    });
  }
}
