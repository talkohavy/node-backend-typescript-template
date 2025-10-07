import { Application } from 'express';
import { API_URLS } from '../../common/constants';
import { logger } from '../../core';
import { ControllerFactory } from '../../lib/lucky-server';

export class HealthCheckController implements ControllerFactory {
  constructor(private readonly app: Application) {}

  healthCheck() {
    this.app.get(API_URLS.healthCheck, async (_req, res) => {
      logger.info(`GET ${API_URLS.healthCheck} - performing health check`);

      res.json({ status: 'OK' });
    });
  }

  attachRoutes() {
    this.healthCheck();
  }
}
