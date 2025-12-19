import type { Application, NextFunction, Request, Response } from 'express';
import { HEADERS } from '../common/constants';

export function addIdToRequestPlugin(app: Application): void {
  app.use(addIdToRequestMiddleware);
}

function addIdToRequestMiddleware(req: Request, _res: Response, next: NextFunction): void {
  req.headers[HEADERS.RequestId] ??= crypto.randomUUID();

  next();
}
