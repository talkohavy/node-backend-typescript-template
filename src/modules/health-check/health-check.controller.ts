import { Application } from 'express';
import { logger } from '../../lib/logger/logger.service';

export class HealthCheckController {
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  healthCheck() {
    this.app.get('/health-check', async (_req, res) => {
      logger.info('GET /health-check - performing health check');

      res.json({ status: 'OK' });
    });
  }

  attachRoutes() {
    this.healthCheck();
  }
}
