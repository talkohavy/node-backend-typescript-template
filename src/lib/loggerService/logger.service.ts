import { LoggerSettingsConfig } from '../../configurations/types';
import { CallContextService } from '../call-context/call-context.service';
import { CONTEXT_KEYS } from '../call-context/logic/constants';
import { ConfigService } from '../config/config.service';
import { initLogger } from '../logger/logger';
import { ILogger } from '../logger/types';
import { SERVICE_NAME } from './logic/constants';
import { EnrichLogMetadataProps } from './types';

export class LoggerService {
  readonly logger: ILogger;

  public constructor(
    private readonly configService: ConfigService,
    private readonly callContextService: CallContextService,
  ) {
    const settings = this.configService.get<LoggerSettingsConfig>('logSettings');

    const fixedKeys = { domain: SERVICE_NAME };
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

  private addLogContext(data: EnrichLogMetadataProps = {}) {
    const logContextMetadata = this.getLogMetadataFromContext(this.callContextService.getStore());

    const enrichedLogMetadata = { data, ...logContextMetadata };

    return enrichedLogMetadata;
  }

  private getLogMetadataFromContext(callContextStore: Map<string, string | object | boolean>) {
    if (!callContextStore) return {};

    return {
      [CONTEXT_KEYS.RequestId]: callContextStore.get(CONTEXT_KEYS.RequestId) as string,
      [CONTEXT_KEYS.Method]: callContextStore.get(CONTEXT_KEYS.Method) as string,
      [CONTEXT_KEYS.Query]: callContextStore.get(CONTEXT_KEYS.Query) as string,
      [CONTEXT_KEYS.OriginalUrl]: callContextStore.get(CONTEXT_KEYS.OriginalUrl) as string,
      [CONTEXT_KEYS.Url]: callContextStore.get(CONTEXT_KEYS.Url) as string,
      [CONTEXT_KEYS.Path]: callContextStore.get(CONTEXT_KEYS.Path) as string,
    };
  }
}

export let logger: LoggerService;

export function initLoggerService(configService: ConfigService, callContextService: CallContextService): LoggerService {
  logger = new LoggerService(configService, callContextService);

  return logger;
}
