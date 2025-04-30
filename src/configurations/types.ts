import { LogLevelKeys } from '../lib/logger/logic/constants';

export type AuthCookieConfig = {
  /**
   * In milliseconds
   */
  maxAge: number;
};

export type JwtConfig = {
  accessSecret: string;
  refreshSecret: string;
  accessExpireTime: string;
  refreshExpireTime: string;
  issuer: string;
};

export type CookieNamesConfig = {
  accessTokenCookieName: string;
  refreshTokenCookieName: string;
};

export type LoggerSettingsConfig = {
  logLevel: LogLevelKeys;
  logEnvironment: string;
};

export type DatabaseConfig = {
  connectionString: string;
};

export type Config = {
  port: number;
  isDev: boolean;
  isCI: boolean;
  authCookie: AuthCookieConfig;
  cookieNames: CookieNamesConfig;
  jwt: JwtConfig;
  logSettings: LoggerSettingsConfig;
  database: DatabaseConfig;
};
