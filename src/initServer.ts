import express from 'express';
import { postUseMiddleware } from './common/utils/postUseMiddleware';
import { preUseMiddleware } from './common/utils/preUseMiddleware';
import { ConfigKeys } from './configurations';
import { bootstrap } from './core';
import { CallContextMiddleware } from './lib/call-context/call-context.middleware';
import { attachBaseMiddlewares } from './middlewares/attachBaseMiddlewares';
import { attachErrorMiddlewares } from './middlewares/attachErrorMiddlewares';
import { BackendModule } from './modules/backend/backend.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
// import { TransactionsModule } from './modules/transactions/transactions.module';

export async function startServer() {
  // Initialize all core services using bootstrap
  const { configService, callContextService, loggerService: logger } = await bootstrap();

  const backendModule = BackendModule.getInstance();
  const healthCheckModule = HealthCheckModule.getInstance();
  // const transactionsModule = TransactionsModule.getInstance();

  const callContextMiddleware = new CallContextMiddleware(callContextService);

  const app = express();

  const PORT = configService.get<number>(ConfigKeys.Port);

  attachBaseMiddlewares({ app });
  callContextMiddleware.use(app, preUseMiddleware, postUseMiddleware);

  healthCheckModule.attachController(app);
  backendModule.attachController(app);
  // attachServerSentEventModule(app);
  // transactionsModule.attachController(app);

  attachErrorMiddlewares({ app });

  app.listen(PORT, () => logger.log(`server started on port ${PORT}`));
}

startServer();
