import express, { type Application } from 'express';
import type { LoggerService } from './lib/logger-service';
import { optimizedModules } from './common/constants';
import { AppFactory } from './lib/lucky-server/app-factory';
import { AuthenticationModule } from './modules/authentication';
// import { BackendModule } from './modules/backend';
import { BooksModule } from './modules/books';
import { FileUploadModule } from './modules/file-upload';
import { HealthCheckModule } from './modules/health-check';
// import { ServerSentEventModule } from './modules/serverSentEvents';
import { SwaggerModule } from './modules/swagger';
import { UsersModule } from './modules/users';
import { bodyLimitPlugin } from './plugins/bodyLimit.plugin';
import { cookieParserPlugin } from './plugins/cookieParser.plugin';
import { corsPlugin } from './plugins/cors/cors.plugin';
import { errorHandlerPlugin } from './plugins/errorHandler.plugin';
import { helmetPlugin } from './plugins/helmet.plugin';
import { requestIdPlugin } from './plugins/request-id.plugin';
import { urlEncodedPlugin } from './plugins/urlEncoded.plugin';

type BuildAppProps = {
  logger: LoggerService;
};

export async function buildApp(props: BuildAppProps) {
  const { logger } = props;

  const app = express() as unknown as Application;

  app.disable('x-powered-by');

  app.logger = logger;

  const appModule = new AppFactory(app);

  appModule.registerPlugins([
    corsPlugin,
    helmetPlugin,
    requestIdPlugin,
    bodyLimitPlugin,
    urlEncodedPlugin,
    cookieParserPlugin,
  ]);

  appModule.registerModules(
    [
      HealthCheckModule,
      AuthenticationModule,
      UsersModule,
      BooksModule,
      FileUploadModule,
      //  BackendModule, // <--- MUST come after UsersModule and AuthenticationModule
      // ServerSentEventModule,
      SwaggerModule,
    ],
    optimizedModules,
  );

  appModule.registerErrorHandler(errorHandlerPlugin);

  return app;
}
