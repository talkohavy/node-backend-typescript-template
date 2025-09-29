import { Application, NextFunction, Request, Response } from 'express';

export class BooksMiddleware {
  public constructor(private readonly app: Application) {}

  public use() {
    this.app.use('/books', (_req: Request, _res: Response, next: NextFunction) => {
      console.log('Books middleware');

      next();
    });
  }
}
