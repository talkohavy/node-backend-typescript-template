import type { LogLevelKeys } from './logic/constants.js';

export type EnrichLogMetadataProps = { [key: string]: any };

export interface LoggerSettings {
  logLevel: LogLevelKeys;
  logEnvironment: string;
}
