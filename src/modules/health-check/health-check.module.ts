import type { Application } from 'express';
import type { ModuleFactory } from '../../lib/lucky-server';
import { HealthCheckController } from './health-check.controller';

export class HealthCheckModule implements ModuleFactory {
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
