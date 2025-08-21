export const LogLevel = {
  Debug: 'debug',
  Info: 'info',
  Warn: 'warn',
  Error: 'error',
  Fatal: 'fatal',
} as const;

type LogLevelType = typeof LogLevel;
export type LogLevelKeys = keyof LogLevelType;
export type LogLevelValues = LogLevelType[LogLevelKeys];

export const LogLevelToNumber: Record<LogLevelValues, number> = {
  [LogLevel.Fatal]: 0,
  [LogLevel.Error]: 1,
  [LogLevel.Warn]: 3,
  [LogLevel.Info]: 4,
  [LogLevel.Debug]: 5,
};
