import { Application, NextFunction, Request, Response } from 'express';
import { API_URLS } from '../../../common/constants';

export class AuthenticationMiddleware {
  public constructor(private readonly app: Application) {}

  public use(): void {
    this.app.use(API_URLS.auth, (_req: Request, _res: Response, next: NextFunction): void => {
      console.log('authentication middleware');

      next();
    });
  }
}
