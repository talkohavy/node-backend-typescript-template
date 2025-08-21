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
