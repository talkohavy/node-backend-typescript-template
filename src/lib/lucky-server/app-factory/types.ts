export interface StaticModule {
  getInstance: () => ModuleFactory;
}

export interface ModuleFactory {
  attachController(app: any): void;
  attachEventHandlers?(io: any): void;
}

export type ErrorHandlerFn = (app: any) => void;

export type MiddlewareFactory = (app: any) => void;
