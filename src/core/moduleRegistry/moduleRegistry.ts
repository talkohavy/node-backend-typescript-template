import { Application } from 'express';
import { StaticModule, RegisteredModule } from './types';

export class ModuleRegistry {
  private modules: RegisteredModule[] = [];

  constructor(modules: StaticModule[]) {
    this.modules = [];

    this.registerModules(modules);
  }

  private registerModules(modules: StaticModule[]): void {
    modules.forEach((module) => {
      this.modules.push(module.getInstance());
    });
  }

  attachAllControllers(app: Application): void {
    this.modules.forEach((module) => {
      module.attachController(app);
    });
  }
}
