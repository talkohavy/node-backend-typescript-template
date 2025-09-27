import { configuration } from '../configurations';
import { initCallContextService } from './initCallContextService';
import { initConfigService } from './initConfigService';
import { initLoggerService } from './initLoggerService';

export async function bootstrap() {
  const configSettings = configuration();
  const configService = initConfigService(configSettings);

  const callContextService = initCallContextService();

  const loggerService = initLoggerService(configService, callContextService);

  return { configService, callContextService, loggerService };
}
