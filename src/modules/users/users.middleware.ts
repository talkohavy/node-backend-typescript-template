import { Application, NextFunction, Request, Response } from 'express';

export class UsersMiddleware {
  public constructor() {}

  public use(app: Application): void {
    app.use('/users', (_req: Request, _res: Response, next: NextFunction): void => {
      console.log('Users middleware');

      next();
    });
  }
}
