import { ConfigKeys } from '../configurations/constants';
import { CallContextService } from '../lib/call-context';
import { ConfigService } from '../lib/config-service';
import { Logger, LogLevel, type LoggerSettings } from '../lib/logger';
import { LoggerService } from '../lib/logger-service';

export let logger: LoggerService;

export function initLoggerService(configService: ConfigService, callContextService: CallContextService): LoggerService {
  const logSettings = configService.get(ConfigKeys.LogSettings);

  const settings: LoggerSettings = {
    logLevel: logSettings.logLevel || LogLevel.Debug,
    useColoredOutput: logSettings.useColoredOutput ?? true,
  };

  const fixedKeys: Record<string, any> = {
    serviceName: logSettings.serviceName || 'my-service',
    environment: logSettings.logEnvironment,
  };

  const loggerInstance = new Logger({ settings, fixedKeys });

  logger = new LoggerService(loggerInstance, callContextService);

  return logger;
}
