import { Application, Request, Response } from 'express';
import { logger } from '../../../core';
import { ControllerFactory } from '../../../lib/controller-factory';

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
