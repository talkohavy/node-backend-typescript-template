export type Config = {
  port: number;
  cookieNames: {
    accessTokenCookieName: string;
  };
  logSettings: {
    logLevel: string;
    logEnvironment: string;
  };
  database: {
    connectionString: string;
  };
};
