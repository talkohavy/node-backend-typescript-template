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

  registerPlugins(middlewares: MiddlewareFactory[]): void {
    middlewares.forEach((middleware) => {
      this.registeredMiddleware.push(middleware);
      middleware(this.app);
    });
  }

  registerErrorHandler(errorHandler: ErrorHandlerFn): void {
    errorHandler(this.app);
  }
}
