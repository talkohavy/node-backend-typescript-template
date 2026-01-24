import { type Config, configuration } from '../configurations';
import { ConfigService } from '../lib/config-service';
import type { Application } from 'express';

export function configServicePlugin(app: Application) {
  const configSettings: Config = configuration();
  const configService = new ConfigService(configSettings);

  app.configService = configService;
}
