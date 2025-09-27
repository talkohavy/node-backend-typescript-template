import express from 'express';
import { postUseMiddleware } from './common/utils/postUseMiddleware';
import { preUseMiddleware } from './common/utils/preUseMiddleware';
import { configuration } from './configurations';
import { ConfigKeys } from './configurations/constants';
import { initConfigService } from './configurations/initConfigService';
import { initLoggerService } from './configurations/initLoggerService';
import { CallContextMiddleware } from './lib/call-context/call-context.middleware';
import { initCallContextService } from './lib/call-context/call-context.service';
import { attachBaseMiddlewares } from './middlewares/attachBaseMiddlewares';
import { attachErrorMiddlewares } from './middlewares/attachErrorMiddlewares';
import { BackendModule } from './modules/backend/backend.module';
import { attachHealthCheckModule } from './modules/health-check/health-check.module';
// import { TransactionsModule } from './modules/transactions/transactions.module';

export async function startServer() {
  const configService = initConfigService(configuration());
  const callContextService = initCallContextService();
  const logger = initLoggerService(callContextService);
  const backendModule = BackendModule.getInstance();
  // const transactionsModule = TransactionsModule.getInstance();

  const callContextMiddleware = new CallContextMiddleware(callContextService);

  const app = express();

  const PORT = configService.get<number>(ConfigKeys.Port);

  attachBaseMiddlewares({ app });
  callContextMiddleware.use(app, preUseMiddleware, postUseMiddleware);

  attachHealthCheckModule(app);
  backendModule.attachController(app);
  // attachServerSentEventModule(app);
  // transactionsModule.attachController(app);

  attachErrorMiddlewares({ app });

  app.listen(PORT, () => logger.log(`server started on port ${PORT}`));
}

startServer();
