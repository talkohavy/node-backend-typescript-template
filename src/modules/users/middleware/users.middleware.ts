import { Application, NextFunction, Request, Response } from 'express';

export class UsersMiddleware {
  public constructor(private readonly app: Application) {}

  public use() {
    this.app.use('/users', (_req: Request, _res: Response, next: NextFunction) => {
      console.log('Users middleware');

      next();
    });
  }
}
