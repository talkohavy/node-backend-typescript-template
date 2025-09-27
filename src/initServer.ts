import express from 'express';
import { postUseMiddleware } from './common/utils/postUseMiddleware';
import { preUseMiddleware } from './common/utils/preUseMiddleware';
import { ConfigKeys } from './configurations';
import { bootstrap, ModuleRegistry } from './core';
import { CallContextMiddleware } from './lib/call-context/call-context.middleware';
import { attachBaseMiddlewares } from './middlewares/attachBaseMiddlewares';
import { attachErrorMiddlewares } from './middlewares/attachErrorMiddlewares';

export async function startServer() {
  const { configService, callContextService, loggerService: logger } = await bootstrap();

  const moduleRegistry = new ModuleRegistry();

  const callContextMiddleware = new CallContextMiddleware(callContextService);

  const app = express();

  const PORT = configService.get<number>(ConfigKeys.Port);

  attachBaseMiddlewares({ app });
  callContextMiddleware.use(app, preUseMiddleware, postUseMiddleware);

  moduleRegistry.attachAllControllers(app);

  attachErrorMiddlewares({ app });

  app.listen(PORT, () => logger.log(`server started on port ${PORT}`));
}

startServer();
