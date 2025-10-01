import express from 'express';
import { ConfigKeys } from './configurations';
import { bootstrap, ModuleRegistry } from './core';
import { initConnections } from './core/initConnections';
import { MiddlewareRegistry } from './core/middlewareRegistry/middlewareRegistry';

export async function startServer() {
  const { configService, loggerService: logger } = await bootstrap();
  await initConnections();

  const moduleRegistry = new ModuleRegistry();
  const middlewareRegistry = new MiddlewareRegistry();

  const app = express();

  middlewareRegistry.usePreMiddlewares(app);

  moduleRegistry.attachAllControllers(app);

  middlewareRegistry.usePostMiddlewares(app);

  const PORT = configService.get<number>(ConfigKeys.Port);
  app.listen(PORT, () => logger.log(`server started on port ${PORT}`));
}

startServer();
