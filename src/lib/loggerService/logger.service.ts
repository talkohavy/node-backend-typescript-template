import type { ILogger } from '../logger';
import { LoggerServiceSettings } from '../../configurations/types';
import { CallContextService } from '../call-context/call-context.service';
import { ConfigService } from '../config/config.service';
import { initLogger } from '../logger/logger';
import { Context } from './logic/constants';

export class LoggerService {
  readonly logger: ILogger;

  public constructor(
    private readonly configService: ConfigService,
    private readonly callContextService: CallContextService,
  ) {
    const settings = this.configService.get<LoggerServiceSettings>('logSettings');

    const fixedKeys = { serviceName: settings.serviceName };
    this.logger = initLogger(settings, fixedKeys);
  }

  debug(message: string, data?: any) {
    const logMetadata = this.addLogContext(data);

    this.logger.debug(message, logMetadata);
  }

  log(message: string, data?: any) {
    const logMetadata = this.addLogContext(data);

    this.logger.log(message, logMetadata);
  }

  info(message: string, data?: any) {
    const logMetadata = this.addLogContext(data);

    this.logger.debug(message, logMetadata);
  }

  warn(message: string, data?: any) {
    const logMetadata = this.addLogContext(data);

    this.logger.warn(message, logMetadata);
  }

  error(message: string, data?: any) {
    // No need to call shouldLog. ALWAYS print if error and above!
    const logMetadata = this.addLogContext(data);

    this.logger.error(message, logMetadata);
  }

  fatal(message: string, data?: any) {
    // No need to call shouldLog. ALWAYS print if error and above!
    const logMetadata = this.addLogContext(data);

    this.logger.fatal(message, logMetadata);
  }

  private addLogContext(data: Record<string, any> = {}) {
    const logContextMetadata = this.getLogMetadataFromContext(this.callContextService.getStore());

    const enrichedLogMetadata = { data, ...logContextMetadata };

    return enrichedLogMetadata;
  }

  private getLogMetadataFromContext(callContextStore: Map<string, string | object | boolean>) {
    if (!callContextStore) return {};

    return {
      [Context.RequestId]: callContextStore.get(Context.RequestId) as string,
      [Context.Method]: callContextStore.get(Context.Method) as string,
      [Context.Query]: callContextStore.get(Context.Query) as string,
      [Context.OriginalUrl]: callContextStore.get(Context.OriginalUrl) as string,
      [Context.Url]: callContextStore.get(Context.Url) as string,
      [Context.Path]: callContextStore.get(Context.Path) as string,
    };
  }
}

export let logger: LoggerService;

export function initLoggerService(configService: ConfigService, callContextService: CallContextService): LoggerService {
  logger = new LoggerService(configService, callContextService);

  return logger;
}
