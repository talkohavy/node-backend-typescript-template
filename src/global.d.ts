import type { Client as PgClient } from 'pg';

declare module 'express' {
  export interface Request {
    user?: Record<string, any>;
  }

  export interface Application {
    logger: LoggerService;
    configService: ConfigService;
    callContextService: CallContextService;
    redis: {
      pub: RedisClientType;
      sub: RedisClientType;
    };
    pg: PgClient;
  }
}
