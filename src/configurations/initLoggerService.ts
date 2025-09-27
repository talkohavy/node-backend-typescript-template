import { CallContextService } from '../lib/call-context';
import { Logger, LogLevel, type LoggerSettings } from '../lib/logger';
import { LoggerService } from '../lib/logger-service';

export let logger: LoggerService;

export function initLoggerService(callContextService: CallContextService): LoggerService {
  const settings: LoggerSettings = {
    logLevel: LogLevel.Debug,
    useColoredOutput: true,
  };

  const fixedKeys: Record<string, any> = {
    serviceName: 'my-service',
  };

  const loggerInstance = new Logger({ settings, fixedKeys });

  logger = new LoggerService(loggerInstance, callContextService);

  return logger;
}
