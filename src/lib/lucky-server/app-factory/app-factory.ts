import type { ModuleConstructor, PluginAsyncFn, PluginFn } from './types';

export class AppFactory {
  private registeredModules: any[] = [];
  private registeredPlugins: PluginFn[] = [];

  constructor(
    public readonly app: any,
    optimizedApp = {},
  ) {
    Object.assign(this.app, optimizedApp);
  }

  registerModules(modules: ModuleConstructor[]): void {
    modules.forEach((Module) => {
      const moduleInstance = new Module(this.app);
      this.registeredModules.push(moduleInstance);
      this.app.modules[Module.name] = moduleInstance;
    });
  }

  async registerPlugins(plugins: (PluginFn | PluginAsyncFn)[]): Promise<void> {
    for (const plugin of plugins) {
      this.registeredPlugins.push(plugin);
      await plugin(this.app);
    }
  }

  registerErrorHandler(errorHandler: PluginFn | PluginAsyncFn): void {
    errorHandler(this.app);
  }

  registerPathNotFoundHandler(pathNotFoundHandler: PluginFn): void {
    pathNotFoundHandler(this.app);
  }
}
