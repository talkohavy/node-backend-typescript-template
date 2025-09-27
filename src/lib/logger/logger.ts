import { colorMyJson } from 'color-my-json';
import { ILogger, LoggerConstructorProps } from './logger.interface';
import { LogLevel, LogLevelToNumber, LogLevelValues } from './logic/constants';
import { createEnumerableError } from './logic/utils/createEnumerableError';
import { LoggerSettings } from './types';

export class Logger implements ILogger {
  private readonly settings: LoggerSettings;
  private readonly fixedKeys: Record<string, any>;
  private readonly globalLogLevelValue: number;

  public constructor(props: LoggerConstructorProps) {
    const { settings, fixedKeys = {} } = props;

    const reservedKeys = ['_time', 'message', 'level', 'data', 'error'];
    for (const key of reservedKeys) {
      if (key in fixedKeys) {
        throw new Error(`The key "${key}" is reserved and CANNOT be used!`);
      }
    }

    this.globalLogLevelValue = LogLevelToNumber[settings?.logLevel ?? LogLevel.Info];

    this.settings = settings;
    this.fixedKeys = fixedKeys;
  }

  debug(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.Debug)) return;

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.Debug);

    this.logMe(logMetadata);
  }

  log(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.Info)) return;

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.Info);

    this.logMe(logMetadata);
  }

  info(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.Info)) return;

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.Info);

    this.logMe(logMetadata);
  }

  warn(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.Warn)) return;

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.Warn);

    this.logMe(logMetadata);
  }

  error(message: string, data?: any) {
    // No need to call shouldLog. ALWAYS print if error and above!

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.Error);

    this.logMe(logMetadata);
  }

  fatal(message: string, data?: any) {
    // No need to call shouldLog. ALWAYS print if error and above!

    const logMetadata = this.enrichLogMetadata(message, data, LogLevel.Fatal);

    this.logMe(logMetadata);
  }

  private logMe(logMetadata: string): void {
    if (this.settings.useColoredOutput) {
      this.logFormattedOutput(logMetadata);
    } else {
      this.logRawOutput(logMetadata);
    }
  }

  private logFormattedOutput(logMetadata: string): void {
    console.log('\n', colorMyJson(logMetadata));
  }

  private logRawOutput(logMetadata: string): void {
    console.log(logMetadata);
  }

  private enrichLogMetadata(message: string, extraData: Record<string, any>, level: LogLevelValues) {
    const error = extraData?.error && createEnumerableError(extraData.error);

    const enrichedLogMetadata = {
      _time: new Date().toISOString(),
      message,
      level,
      ...extraData, // must come before error key!
      error,
      ...this.fixedKeys,
    };

    return JSON.stringify(enrichedLogMetadata, null, 2);
  }

  private shouldLog(logLevel: LogLevelValues) {
    const currentLogLevelValue = LogLevelToNumber[logLevel];

    return currentLogLevelValue <= this.globalLogLevelValue;
  }
}
