import type { Application } from 'express';
import type { ControllerFactory } from '../../lib/lucky-server';
import { API_URLS } from '../../common/constants';
import { logger } from '../../core';

export class HealthCheckController implements ControllerFactory {
  constructor(private readonly app: Application) {}

  private healthCheck() {
    this.app.get(API_URLS.healthCheck, async (_req, res) => {
      logger.info(`GET ${API_URLS.healthCheck} - performing health check`);

      res.json({ status: 'OK' });
    });
  }

  attachRoutes() {
    this.healthCheck();
  }
}
