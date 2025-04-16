import { Config } from './types.js';

export function configuration(): Config {
  return {
    cookieNames: {
      accessTokenCookieName: 'access_token',
    },
    logSettings: {
      logLevel: 'info',
      logEnvironment: 'development',
    },
  };
}
