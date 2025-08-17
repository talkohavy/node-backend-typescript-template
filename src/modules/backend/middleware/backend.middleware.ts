import { Application, NextFunction, Request, Response } from 'express';

export class BackendMiddleware {
  public constructor(private readonly app: Application) {}

  public use(): void {
    this.app.use('/backend', (_req: Request, _res: Response, next: NextFunction): void => {
      console.log('backend middleware');

      next();
    });
  }
}
