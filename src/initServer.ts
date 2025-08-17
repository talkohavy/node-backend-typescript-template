import express from 'express';
import { configuration } from './configurations';
import { CallContextMiddleware } from './lib/call-context/call-context.middleware';
import { initCallContextService } from './lib/call-context/call-context.service';
import { initConfigService } from './lib/config/config.service';
import { initLoggerService } from './lib/logger/logger.service';
import { attachBaseMiddlewares } from './middlewares/attachBaseMiddlewares';
import { attachErrorMiddlewares } from './middlewares/attachErrorMiddlewares';
import { getAuthenticationModule } from './modules/authentication/authentication.module';
import { attachBackendModule } from './modules/backend/backend.module';
import { getBooksModule } from './modules/books/books.module';
import { attachHealthCheckModule } from './modules/health-check/health-check.module';
import { getUsersModule } from './modules/users/users.module';

export async function startServer() {
  const configService = initConfigService(configuration());
  const callContextService = initCallContextService();
  const logger = initLoggerService(configService, callContextService);
  const callContextMiddleware = new CallContextMiddleware(callContextService, configService);

  const usersModule = getUsersModule();
  const booksModule = getBooksModule();
  const authenticationModule = getAuthenticationModule();

  const app = express();

  const PORT = configService.get<number>('port');

  attachBaseMiddlewares({ app });
  callContextMiddleware.use(app, ['/health-check']);

  attachBackendModule(app);
  attachHealthCheckModule(app);
  usersModule.attachController(app);
  booksModule.attachController(app);
  authenticationModule.attachController(app);
  // attachServerSentEventModule(app);
  // attachTransactionsModule(app);

  attachErrorMiddlewares({ app });

  app.listen(PORT, () => logger.log(`server started on port ${PORT}`));
}

startServer();
