import { Application } from 'express';
import { HealthCheckController } from './health-check.controller.js';

export function attachHealthCheckModule(app: Application) {
  const controller = new HealthCheckController(app);

  controller.attachRoutes();
}
