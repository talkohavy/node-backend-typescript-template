import { LoggerSettings } from './types';

export type LoggerConstructorProps = {
  settings: LoggerSettings;
  /**
   * Optional fixed keys with fixed values to include in every log entry.
   *
   * Useful for things like serviceName, environment, etc.
   */
  fixedKeys?: Record<string, any>;
};

export interface ILogger {
  debug(message: string, data?: any): void;
  log(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, data?: any): void;
  fatal(message: string, data?: any): void;
}
