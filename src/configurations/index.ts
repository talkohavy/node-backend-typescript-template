import { Config } from './types';

export function configuration(): Config {
  return {
    port: (process.env.BACKEND_PORT || 8001) as number,
    isDev: !!process.env.IS_DEV,
    isCI: !!process.env.IS_CI,
    authCookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    jwt: {
      accessSecret: '1234',
      accessExpireTime: '1h',
      refreshSecret: '1234',
      refreshExpireTime: '1d',
      issuer: 'luckylove',
    },
    cookieNames: {
      accessTokenCookieName: 'access_token',
      refreshTokenCookieName: 'refresh_token',
    },
    logSettings: {
      logLevel: 'info',
      logEnvironment: 'development',
    },
    database: {
      connectionString: process.env.DB_CONNECTION_STRING || 'postgres://user:password@localhost:5432/mydb',
    },
  };
}
