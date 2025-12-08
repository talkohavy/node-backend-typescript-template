import cookieParser from 'cookie-parser';
import express from 'express';
import {
  contentSecurityPolicy,
  crossOriginEmbedderPolicy,
  crossOriginOpenerPolicy,
  crossOriginResourcePolicy,
  originAgentCluster,
  referrerPolicy,
  strictTransportSecurity,
  xContentTypeOptions,
  xDnsPrefetchControl,
  xDownloadOptions,
  xFrameOptions,
  xPermittedCrossDomainPolicies,
  xXssProtection,
} from 'helmet';
// import { TransactionsModule } from '../modules/transactions';
import { ConfigKeys } from './configurations';
import { initGlobalServices, initConnections } from './core';
import { AppFactory } from './lib/lucky-server/app-factory';
import { attachErrorMiddlewares } from './middlewares/attachErrorMiddlewares';
import { bodyLimitMiddleware } from './middlewares/bodyLimitMiddleware';
import { compressionMiddleware } from './middlewares/compression.middleware';
import { corsMiddleware } from './middlewares/cors.middleware';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import { urlEncodedMiddleware } from './middlewares/urlEncodedMiddleware';
import { BackendModule } from './modules/backend';
// import { BooksModule } from './modules/books';
import { HealthCheckModule } from './modules/health-check';
import { SwaggerModule } from './modules/swagger';
import { UsersModule } from './modules/users';

export async function startServer() {
  const { configService, loggerService: logger } = await initGlobalServices();

  await initConnections(configService);

  const app = express();
  app.disable('x-powered-by');

  const appModule = new AppFactory(app);
  appModule.registerMiddleware([
    requestIdMiddleware,
    bodyLimitMiddleware,
    // --- START HELMET MIDDLEWARES ---
    contentSecurityPolicy(),
    crossOriginEmbedderPolicy({ policy: 'require-corp' }),
    crossOriginOpenerPolicy({ policy: 'same-origin' }),
    crossOriginResourcePolicy({ policy: 'same-origin' }),
    originAgentCluster(),
    referrerPolicy({ policy: 'no-referrer' }),
    strictTransportSecurity(),
    xContentTypeOptions(),
    xDnsPrefetchControl({ allow: false }),
    xDownloadOptions(),
    xFrameOptions({ action: 'sameorigin' }),
    xPermittedCrossDomainPolicies({ permittedPolicies: 'none' }),
    xXssProtection(),
    // --- END HELMET MIDDLEWARES ---
    urlEncodedMiddleware,
    cookieParser(),
    compressionMiddleware,
    corsMiddleware,
  ]);

  appModule.registerModules([HealthCheckModule, BackendModule, UsersModule, SwaggerModule]); // BooksModule, BackendModule, TransactionsModule

  appModule.registerErrorHandler(attachErrorMiddlewares);

  const PORT = configService.get<number>(ConfigKeys.Port);

  app.listen(PORT, () => logger.log(`server started on port ${PORT}`));
}

startServer();
