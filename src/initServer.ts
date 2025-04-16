import express from 'express';
import { configuration } from './configurations/index.js';
import { CallContextMiddleware } from './lib/call-context/call-context.middleware.js';
import { initCallContextService } from './lib/call-context/call-context.service.js';
import { initConfigService } from './lib/config/config.service.js';
import { initLoggerService } from './lib/logger/logger.service.js';
import { attachBaseMiddlewares } from './middlewares/attachBaseMiddlewares.js';
import { attachErrorMiddlewares } from './middlewares/attachErrorMiddlewares.js';
import { attachBooksModule } from './modules/books/books.module.js';
import { attachHealthCheckModule } from './modules/health-check/health-check.module.js';
import { attachServerSentEventModule } from './modules/serverSentEvents/serverSentEvents.module.js';
import { attachUsersModule } from './modules/users/users.module.js';

export async function startServer() {
  const configService = initConfigService(configuration());
  const callContextService = initCallContextService();
  const logger = initLoggerService(configService, callContextService);
  const callContextMiddleware = new CallContextMiddleware(callContextService, configService);

  const app = express();

  attachBaseMiddlewares({ app });
  callContextMiddleware.use(app, ['/health-check']);

  attachServerSentEventModule(app);
  attachHealthCheckModule(app);
  attachUsersModule(app);
  attachBooksModule(app);

  attachErrorMiddlewares({ app });

  app.listen(process.env.BACKEND_PORT, () => logger.log(`server started on port ${process.env.BACKEND_PORT}`));
}

startServer();
