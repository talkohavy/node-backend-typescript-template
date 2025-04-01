import { Application, Request, Response, NextFunction } from 'express';

export function attachHttpRoutes(app: Application): void {
  // @ts-ignore
  app.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = { ok: false, message: 'reached the ** route' };
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
}
