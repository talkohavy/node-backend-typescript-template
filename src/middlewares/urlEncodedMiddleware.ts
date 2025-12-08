import express, { type NextFunction, type Request, type Response } from 'express';
import { EXCLUDED_PATHS } from '../common/constants';

export function urlEncodedMiddleware(req: Request, res: Response, next: NextFunction) {
  if (EXCLUDED_PATHS.includes(req.path)) return next();

  express.urlencoded({ extended: true, limit: '1mb' })(req, res, next);
}
