import { Request, Response, NextFunction } from 'express';

export function preUseMiddleware(req: Request, res: Response, _next: NextFunction) {
  // excluded paths:
  if (['/health-check'].includes(req.path)) return { shouldCallNext: true };

  if (req.originalUrl.includes('favicon.ico')) {
    void res.status(204).end();
    return { shouldReturn: true };
  }
}
