import type { NextFunction, Request, Response } from 'express';
import { HEADERS } from '../common/constants';

export function requestIdPlugin(app: any): void {
  app.use(requestIdMiddleware);
}

function requestIdMiddleware(req: Request, _res: Response, next: NextFunction): void {
  req.headers[HEADERS.RequestId] ??= crypto.randomUUID();

  next();
}
