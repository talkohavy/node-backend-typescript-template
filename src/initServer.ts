import express from 'express';
import { ConfigKeys } from './configurations';
import { bootstrap, ModuleRegistry } from './core';
import { MiddlewareRegistry } from './core/middlewareRegistry/middlewareRegistry';

export async function startServer() {
  const { configService, loggerService: logger } = await bootstrap();

  const moduleRegistry = new ModuleRegistry();
  const middlewareRegistry = new MiddlewareRegistry();

  const app = express();

  middlewareRegistry.useAllMiddlewares(app);
  moduleRegistry.attachAllControllers(app);

  const PORT = configService.get<number>(ConfigKeys.Port);
  app.listen(PORT, () => logger.log(`server started on port ${PORT}`));
}

startServer();
