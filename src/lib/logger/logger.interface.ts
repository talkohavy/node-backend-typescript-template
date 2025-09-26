import { LoggerSettings } from './types';

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
