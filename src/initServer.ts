import express from 'express';
import { optimizedModules } from './common/constants';
import { ConfigKeys } from './configurations';
import { initGlobalServices, initConnections } from './core';
import { AppFactory } from './lib/lucky-server/app-factory';
import { AuthenticationModule } from './modules/authentication';
// import { BackendModule } from './modules/backend';
import { BooksModule } from './modules/books';
import { FileUploadModule } from './modules/file-upload';
import { HealthCheckModule } from './modules/health-check';
import { SwaggerModule } from './modules/swagger';
import { UsersModule } from './modules/users';
import { bodyLimitPlugin } from './plugins/bodyLimit.plugin';
import { cookieParserPlugin } from './plugins/cookieParser.plugin';
import { corsPlugin } from './plugins/cors/cors.plugin';
import { errorHandlerPlugin } from './plugins/errorHandler.plugin';
import { helmetPlugin } from './plugins/helmet.plugin';
import { requestIdPlugin } from './plugins/request-id.plugin';
import { urlEncodedPlugin } from './plugins/urlEncoded.plugin';

export async function startServer() {
  const { configService, loggerService: logger } = await initGlobalServices();

  await initConnections(configService);

  const app = express();
  app.disable('x-powered-by');

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
      //  BackendModule,
      SwaggerModule,
    ],
    optimizedModules,
  );

  appModule.registerErrorHandler(errorHandlerPlugin);

  const PORT = configService.get<number>(ConfigKeys.Port);

  app.listen(PORT, () => logger.log(`server started on port ${PORT}`));
}

startServer();
