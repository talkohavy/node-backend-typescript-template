import { Config } from './types.js';

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
  };
}
