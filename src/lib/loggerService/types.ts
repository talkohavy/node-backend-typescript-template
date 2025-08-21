import type { LogLevelKeys } from './logic/constants';

export type EnrichLogMetadataProps = { [key: string]: any };

export interface LoggerSettings {
  logLevel: LogLevelKeys;
  logEnvironment: string;
  useColoredOutput: boolean;
}
