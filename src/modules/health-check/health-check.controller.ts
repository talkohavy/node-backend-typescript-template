import { Application } from 'express';
import { logger } from '../../core';
import { ControllerFactory } from '../../lib/controller-factory';

export class HealthCheckController implements ControllerFactory {
  constructor(private readonly app: Application) {}

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
