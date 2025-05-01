import { colorMyJson } from 'color-my-json';
import { LoggerSettingsConfig } from '../../configurations/types';
import { CallContextService } from '../call-context/call-context.service';
import { CONTEXT_KEYS } from '../call-context/logic/constants';
import { ConfigService } from '../config/config.service';
import { LogLevel, LogLevelKeys, LogLevelToNumber, SERVICE_NAME } from './logic/constants';
import { createEnumerableError } from './logic/utils/createEnumerableError';
import { EnrichLogMetadataProps, LoggerSettings } from './types';

export class LoggerService {
  private readonly loggerSettings: LoggerSettings;
  private readonly domain: string;
  private readonly globalLogLevel: number;

  public constructor(
    private readonly configService: ConfigService,
    private readonly callContextService: CallContextService,
  ) {
    const loggerSettings = this.configService.get<LoggerSettingsConfig>('logSettings');
    this.globalLogLevel = LogLevelToNumber[loggerSettings?.logLevel ?? LogLevel.INFO];

    this.loggerSettings = loggerSettings;
    this.domain = SERVICE_NAME;
  }

  debug(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.DEBUG);

    // console.log(COLORS.blue, '\n', logMetadata, COLORS.stop);
    console.log('\n', colorMyJson(logMetadata));
  }

  log(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.INFO);

    // console.log('\n', logMetadata);
    console.log('\n', colorMyJson(logMetadata));
  }

  info(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.INFO);

    // console.log(COLORS.green, '\n', logMetadata, COLORS.stop);
    console.log(colorMyJson(logMetadata));
  }

  warn(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.WARN);

    // console.log(COLORS.yellow, '\n', logMetadata, COLORS.stop);
    console.log('\n', colorMyJson(logMetadata));
  }

  error(message: string, data?: any): void {
    // No need to call shouldLog. ALWAYS print if error and above!

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.ERROR);

    // console.log(COLORS.red, '\n', logMetadata, COLORS.stop);
    console.log('\n', colorMyJson(logMetadata));
  }

  fatal(message: string, data?: any): void {
    // No need to call shouldLog. ALWAYS print if error and above!

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.FATAL);

    // console.log(COLORS.red, '\n', logMetadata, COLORS.stop);
    console.log('\n', colorMyJson(logMetadata));
  }

  private enrichLogMetadata(message: string, extraData: EnrichLogMetadataProps, level: LogLevelKeys) {
    const error = extraData?.error && createEnumerableError(extraData.error);

    const logContextMetadata = this.getLogMetadataFromContext(this.callContextService.getStore());

    const enrichedLogMetadata = {
      _time: new Date().toISOString(),
      message,
      level,
      ...logContextMetadata,
      domain: this.domain,
      logEnv: this.loggerSettings.logEnvironment,
      data: extraData,
      error,
    };

    return JSON.stringify(enrichedLogMetadata, null, 2);
  }

  private shouldLog(funcLogLevelAsString: LogLevelKeys) {
    const functionLogLevel = LogLevelToNumber[funcLogLevelAsString];

    return functionLogLevel <= this.globalLogLevel;
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
