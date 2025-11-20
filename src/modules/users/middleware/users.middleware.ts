import type { Application, NextFunction, Request, Response } from 'express';
import { API_URLS } from '../../../common/constants';

export class UsersMiddleware {
  public constructor(private readonly app: Application) {}

  public use() {
    this.app.use(API_URLS.users, (_req: Request, _res: Response, next: NextFunction) => {
      console.log('Users middleware');

      next();
    });
  }
}
