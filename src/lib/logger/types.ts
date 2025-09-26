import type { LogLevelValues } from './logic/constants';

export type LoggerSettings = {
  logLevel?: LogLevelValues;
  useColoredOutput?: boolean;
};
