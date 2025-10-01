import express from 'express';
import { ConfigKeys } from './configurations';
import { initGlobalServices, initConnections, ModuleRegistry, MiddlewareRegistry } from './core';
import { HealthCheckModule } from './modules/health-check';
import { UsersModule } from './modules/users';
// import { BackendModule } from '../../modules/backend';
// import { TransactionsModule } from '../modules/transactions';

export async function startServer() {
  const { configService, callContextService, loggerService: logger } = await initGlobalServices();

  await initConnections(configService);

  const moduleRegistry = new ModuleRegistry([HealthCheckModule, UsersModule]); // BackendModule, TransactionsModule
  const middlewareRegistry = new MiddlewareRegistry(callContextService);

  const app = express();

  middlewareRegistry.usePreMiddlewares(app);

  moduleRegistry.attachAllControllers(app);

  middlewareRegistry.usePostMiddlewares(app);

  const PORT = configService.get<number>(ConfigKeys.Port);
  app.listen(PORT, () => logger.log(`server started on port ${PORT}`));
}

startServer();
