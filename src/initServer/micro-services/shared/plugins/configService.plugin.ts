import type { Application } from 'express';
import { ConfigService } from '../../../../lib/config-service';

export function configServicePluggable(configSettings: Record<string, any>) {
  return function configServicePluging(app: Application) {
    const configService = new ConfigService(configSettings);

    app.configService = configService;
  };
}
