import type { ModuleConstructor, PluginFn } from './types';

export class AppFactory {
  private registeredModules: any[] = [];
  private registeredMiddleware: PluginFn[] = [];

  constructor(public readonly app: any) {}

  registerModules(modules: ModuleConstructor[], optimizedModules = {}): void {
    this.app.modules = optimizedModules;

    modules.forEach((Module) => {
      const moduleInstance = new Module(this.app);
      this.registeredModules.push(moduleInstance);
      this.app.modules[Module.name] = moduleInstance;
    });
  }

  registerPlugins(middlewares: PluginFn[]): void {
    middlewares.forEach((middleware) => {
      this.registeredMiddleware.push(middleware);
      middleware(this.app);
    });
  }

  registerErrorHandler(errorHandler: PluginFn): void {
    errorHandler(this.app);
  }

  registerPathNotFoundHandler(pathNotFoundHandler: PluginFn): void {
    pathNotFoundHandler(this.app);
  }
}
