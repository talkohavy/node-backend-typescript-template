import { NextFunction, Request, Response } from 'express';
import { HEADERS } from '../common/constants';

export function requestIdMiddleware(req: Request, _res: Response, next: NextFunction) {
  req.headers[HEADERS.RequestId] ??= crypto.randomUUID();

  next();
}
