import { Application, Request, Response } from 'express';
import { API_URLS } from '../../../common/constants';
import { logger } from '../../../core';
import { ControllerFactory } from '../../../lib/lucky-server';

export class SessionManagementController implements ControllerFactory {
  constructor(private readonly app: Application) {}

  private logout() {
    this.app.get(API_URLS.authLogout, async (_req: Request, res: Response) => {
      logger.info(`GET ${API_URLS.authLogout} - user logout`);

      // maybe blacklist token here

      res.json({});
    });
  }

  attachRoutes() {
    this.logout();
  }
}
