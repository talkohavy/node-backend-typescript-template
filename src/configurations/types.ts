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

type SingleCookie = {
  name: string;
  domain: string;
  maxAge: number;
};

export type CookiesConfig = {
  accessCookie: SingleCookie;
  refreshCookie: SingleCookie;
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
  cookies: CookiesConfig;
  jwt: JwtConfig;
  logSettings: LoggerSettingsConfig;
  database: DatabaseConfig;
};
