import { Application } from 'express';
import { HealthCheckController } from './health-check.controller';

export class HealthCheckModule {
  private static instance: HealthCheckModule;

  private constructor() {}

  static getInstance(): HealthCheckModule {
    if (!HealthCheckModule.instance) {
      HealthCheckModule.instance = new HealthCheckModule();
    }
    return HealthCheckModule.instance;
  }

  attachController(app: Application): void {
    const controller = new HealthCheckController(app);

    controller.attachRoutes();
  }
}
