import type { LogLevelValues } from './logic/constants';

export type EnrichLogMetadataProps = { [key: string]: any };

export type LoggerSettings = {
  logLevel: LogLevelValues;
  useColoredOutput: boolean;
};

export type LoggerConstructorProps = {
  settings: LoggerSettings;
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
