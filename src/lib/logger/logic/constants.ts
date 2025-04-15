export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
} as const;

export type LogLevelKeys = (typeof LogLevel)[keyof typeof LogLevel];

export const SERVICE_NAME = 'MY_BACKEND';

export const LogLevelToNumber: Record<LogLevelKeys, number> = {
  [LogLevel.FATAL]: 0,
  [LogLevel.ERROR]: 1,
  [LogLevel.WARN]: 3,
  [LogLevel.INFO]: 4,
  [LogLevel.DEBUG]: 5,
};
