import { Application } from 'express';
import { BackendModule } from '../../modules/backend';
import { HealthCheckModule } from '../../modules/health-check';
import { IModule } from './types';
// import { TransactionsModule } from '../modules/transactions';

export class ModuleRegistry {
  private modules: IModule[] = [];

  constructor() {
    this.initializeModules();
  }

  private initializeModules(): void {
    // Register all modules here
    this.modules.push(HealthCheckModule.getInstance());
    this.modules.push(BackendModule.getInstance());
    // this.modules.push(TransactionsModule.getInstance());
  }

  attachAllControllers(app: Application): void {
    this.modules.forEach((module) => {
      module.attachController(app);
    });
  }
}
