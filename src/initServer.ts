import { buildApp } from './app';
import { ConfigKeys } from './configurations';
import { initConnections, initGlobalServices } from './core';

export async function startServer() {
  const { configService, loggerService: logger } = await initGlobalServices();

  await initConnections(configService);

  const app = await buildApp({ logger });

  const PORT = configService.get<number>(ConfigKeys.Port);

  app.listen(PORT, () => logger.log(`server started on port ${PORT}`));
}

process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection', { err });
  console.error('Should not get here!  You are missing a try/catch somewhere.');
});

process.on('uncaughtException', (err) => {
  console.error('uncaughtException', { err });
  console.error('Should not get here! You are missing a try/catch somewhere.');
});

startServer();
