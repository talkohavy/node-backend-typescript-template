import type { ErrorHandlerFn, MiddlewareFactory, ModuleFactory, StaticModule } from './types';

export class AppFactory {
  private registeredModules: ModuleFactory[] = [];
  private registeredMiddleware: MiddlewareFactory[] = [];

  constructor(public readonly app: any) {}

  registerModules(modules: StaticModule[]): void {
    modules.forEach((module) => {
      this.registeredModules.push(module.getInstance());
    });
  }

  registerMiddleware(modules: MiddlewareFactory[]): void {
    modules.forEach((middleware) => {
      this.registeredMiddleware.push(middleware);
      // specific for "express" framework:
      this.app.use(middleware);
    });
  }

  registerErrorHandler(errorHandler: ErrorHandlerFn): void {
    errorHandler(this.app);
  }
}
