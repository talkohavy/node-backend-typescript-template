import { Config } from './types';

export function configuration(): Config {
  return {
    port: (process.env.BACKEND_PORT || 8001) as number,
    cookieNames: {
      accessTokenCookieName: 'access_token',
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
