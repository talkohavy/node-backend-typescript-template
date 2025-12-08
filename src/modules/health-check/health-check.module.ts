import type { Application } from 'express';
import { HealthCheckController } from './health-check.controller';

export class HealthCheckModule {
  private static instance: HealthCheckModule;

  static getInstance(app?: any): HealthCheckModule {
    if (!HealthCheckModule.instance) {
      HealthCheckModule.instance = new HealthCheckModule(app);
    }
    return HealthCheckModule.instance;
  }

  private constructor(private readonly app: any) {
    this.initializeModule();
  }

  private async initializeModule(): Promise<void> {
    this.attachController(this.app);
  }

  private attachController(app: Application): void {
    const controller = new HealthCheckController(app);

    controller.attachRoutes();
  }
}
