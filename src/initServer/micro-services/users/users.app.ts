import express, { type Application } from 'express';
import { optimizedApp } from '../../../common/constants';
import { AppFactory } from '../../../lib/lucky-server/app-factory';
import { HealthCheckModule } from '../../../modules/health-check';
import { UsersModule } from '../../../modules/users';
import { bodyLimitPlugin } from '../../../plugins/bodyLimit.plugin';
import { callContextPlugin } from '../../../plugins/call-context.plugin';
import { configServicePlugin } from '../../../plugins/config-service.plugin';
import { cookieParserPlugin } from '../../../plugins/cookieParser.plugin';
import { corsPlugin } from '../../../plugins/cors/cors.plugin';
import { errorHandlerPlugin } from '../../../plugins/errorHandler.plugin';
import { helmetPlugin } from '../../../plugins/helmet.plugin';
import { loggerPlugin } from '../../../plugins/logger.plugin';
import { pathNotFoundPlugin } from '../../../plugins/pathNotFound.plugin';
import { postgresPlugin } from '../../../plugins/postgres.plugin';
import { redisPlugin } from '../../../plugins/redis.plugin';
import { addIdToRequestPlugin } from '../../../plugins/request-id.plugin';
import { urlEncodedPlugin } from '../../../plugins/urlEncoded.plugin';

export async function buildApp() {
  const app = express() as unknown as Application;

  app.disable('x-powered-by');

  const appModule = new AppFactory(app, optimizedApp);

  await appModule.registerPlugins([
    configServicePlugin,
    callContextPlugin,
    addIdToRequestPlugin,
    loggerPlugin, // <--- dependencies: config-service plugin, call-context plugin
    postgresPlugin, // <--- dependencies: config-service plugin
    redisPlugin, // <--- dependencies: config-service plugin
    corsPlugin,
    helmetPlugin,
    bodyLimitPlugin,
    urlEncodedPlugin,
    cookieParserPlugin,
  ]);

  appModule.registerModules([
    // - Main modules (service providers)
    HealthCheckModule,
    UsersModule,
  ]);

  appModule.registerErrorHandler(errorHandlerPlugin);
  appModule.registerPathNotFoundHandler(pathNotFoundPlugin);

  return app;
}
