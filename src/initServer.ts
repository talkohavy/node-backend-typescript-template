import express from 'express';
import { configuration } from './configurations';
import { CallContextMiddleware } from './lib/call-context/call-context.middleware';
import { initCallContextService } from './lib/call-context/call-context.service';
import { initConfigService } from './lib/config/config.service';
import { initLoggerService } from './lib/logger/logger.service';
import { attachBaseMiddlewares } from './middlewares/attachBaseMiddlewares';
import { attachErrorMiddlewares } from './middlewares/attachErrorMiddlewares';
import { attachBooksModule } from './modules/books/books.module';
import { attachHealthCheckModule } from './modules/health-check/health-check.module';
import { attachServerSentEventModule } from './modules/serverSentEvents/serverSentEvents.module';
import { attachUsersModule } from './modules/users/users.module';

export async function startServer() {
  const configService = initConfigService(configuration());
  const callContextService = initCallContextService();
  const logger = initLoggerService(configService, callContextService);
  const callContextMiddleware = new CallContextMiddleware(callContextService, configService);

  const app = express();

  const PORT = configService.get('port');

  attachBaseMiddlewares({ app });
  callContextMiddleware.use(app, ['/health-check']);

  attachServerSentEventModule(app);
  attachHealthCheckModule(app);
  attachUsersModule(app);
  attachBooksModule(app);

  attachErrorMiddlewares({ app });

  app.listen(PORT, () => logger.log(`server started on port ${PORT}`));
}

startServer();
