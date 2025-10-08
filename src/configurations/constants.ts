import type { EnvironmentValues } from '../common/constants';
import type { RedisConfig } from '../lib/database/redis';
import type { LoggerSettings } from '../lib/logger';

export const ConfigKeys = {
  Port: 'port',
  IsDev: 'isDev',
  IsCI: 'isCI',
  AuthCookie: 'authCookie',
  Cookies: 'cookies',
  Jwt: 'jwt',
  LogSettings: 'logSettings',
  Database: 'database',
  Redis: 'redis',
} as const;

type TypeOfConfigKeys = typeof ConfigKeys;
export type ConfigKeyValues = TypeOfConfigKeys[keyof TypeOfConfigKeys];

export type Config = {
  [ConfigKeys.Port]: number;
  [ConfigKeys.IsDev]: boolean;
  [ConfigKeys.IsCI]: boolean;
  [ConfigKeys.AuthCookie]: AuthCookieConfig;
  [ConfigKeys.Cookies]: CookiesConfig;
  [ConfigKeys.Jwt]: JwtConfig;
  [ConfigKeys.LogSettings]: LoggerServiceSettings;
  [ConfigKeys.Database]: DatabaseConfig;
  [ConfigKeys.Redis]: Partial<RedisConfig>;
};

export type AuthCookieConfig = {
  /**
   * In milliseconds
   */
  maxAge: number;
};

type SingleCookie = {
  name: string;
  domain: string;
  maxAge: number;
};

export type CookiesConfig = {
  accessCookie: SingleCookie;
  refreshCookie: SingleCookie;
};

export type JwtConfig = {
  accessSecret: string;
  refreshSecret: string;
  accessExpireTime: string;
  refreshExpireTime: string;
  issuer: string;
};

export type LoggerServiceSettings = LoggerSettings & {
  serviceName?: string;
  logEnvironment?: EnvironmentValues;
};

export type DatabaseConfig = {
  connectionString: string;
};
