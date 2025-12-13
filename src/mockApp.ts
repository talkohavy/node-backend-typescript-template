import type { LoggerService } from './lib/logger-service';
import { buildApp } from './app';
import { initConnections, initGlobalServices } from './core';

export async function buildMockApp() {
  const { configService } = await initGlobalServices();

  const logger = {
    log: (_message: string) => {},
    debug: (_message: string) => {},
    info: (_message: string) => {},
    warn: (_message: string) => {},
    error: (_message: string) => {},
    fatal: (_message: string) => {},
  } as LoggerService;

  await initConnections(configService);

  const app = await buildApp({ logger });

  return app;
}
