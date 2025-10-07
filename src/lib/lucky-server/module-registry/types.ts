import type { Application } from 'express';

export interface StaticModule {
  getInstance: () => ModuleFactory;
}

export interface ModuleFactory {
  attachController(app: Application): void;
  attachEventHandlers?(io: any): void;
}
