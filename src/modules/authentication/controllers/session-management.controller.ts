import { Application, Request, Response } from 'express';
import { ControllerFactory } from '../../../lib/controller-factory';
import { logger } from '../../../lib/logger';

export class SessionManagementController implements ControllerFactory {
  constructor(private readonly app: Application) {}

  private logout() {
    this.app.get('/auth/logout', async (_req: Request, res: Response) => {
      logger.info('GET /auth/logout - user logout');

      // maybe blacklist token here

      res.json({});
    });
  }

  attachRoutes() {
    this.logout();
  }
}
