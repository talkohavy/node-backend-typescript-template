import { Application, NextFunction, Request, Response } from 'express';

export class AuthenticationMiddleware {
  public constructor(private readonly app: Application) {}

  public use(): void {
    this.app.use('/auth', (_req: Request, _res: Response, next: NextFunction): void => {
      console.log('authentication middleware');

      next();
    });
  }
}
