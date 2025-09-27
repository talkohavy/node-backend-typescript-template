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
  logEnvironment?: string;
};

export type DatabaseConfig = {
  connectionString: string;
};
