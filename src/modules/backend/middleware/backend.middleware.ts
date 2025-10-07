import { Application, NextFunction, Request, Response } from 'express';
import { API_URLS } from '../../../common/constants';

export class BackendMiddleware {
  public constructor(private readonly app: Application) {}

  public use(): void {
    this.app.use(API_URLS.backendMiddleware, (_req: Request, _res: Response, next: NextFunction): void => {
      console.log('backend middleware');

      next();
    });
  }
}
