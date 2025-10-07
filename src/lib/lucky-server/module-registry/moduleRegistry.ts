import type { Application } from 'express';
import type { ModuleFactory, StaticModule } from './types';

export class ModuleRegistry {
  private registeredModules: ModuleFactory[] = [];

  constructor(modules: StaticModule[]) {
    this.registeredModules = [];

    this.registerModules(modules);
  }

  private registerModules(modules: StaticModule[]): void {
    modules.forEach((module) => {
      this.registeredModules.push(module.getInstance());
    });
  }

  attachAllControllers(app: Application): void {
    this.registeredModules.forEach((module) => {
      module.attachController(app);
    });
  }

  attachAllEventHandlers(io: any): void {
    this.registeredModules.forEach((module) => {
      if (module.attachEventHandlers) {
        module.attachEventHandlers(io);
      }
    });
  }
}
