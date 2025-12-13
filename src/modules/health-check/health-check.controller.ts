import type { Application } from 'express';
import type { ControllerFactory } from '../../lib/lucky-server';
import { API_URLS } from '../../common/constants';

export class HealthCheckController implements ControllerFactory {
  constructor(private readonly app: Application) {}

  private healthCheck() {
    this.app.get(API_URLS.healthCheck, async (_req, res) => {
      this.app.logger.info(`GET ${API_URLS.healthCheck} - performing health check`);

      res.json({ status: 'OK' });
    });
  }

  registerRoutes() {
    this.healthCheck();
  }
}
