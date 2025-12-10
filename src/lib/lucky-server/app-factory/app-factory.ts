import type { ErrorHandlerFn, MiddlewareFactory, ModuleConstructor } from './types';

export class AppFactory {
  private registeredModules: any[] = [];
  private registeredMiddleware: MiddlewareFactory[] = [];

  constructor(public readonly app: any) {}

  registerModules(modules: ModuleConstructor[], optimizedModules = {}): void {
    this.app.modules = optimizedModules;

    modules.forEach((Module) => {
      const moduleInstance = new Module(this.app);
      this.registeredModules.push(moduleInstance);
      this.app.modules[Module.name] = moduleInstance;
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
