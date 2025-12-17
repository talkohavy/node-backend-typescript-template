import type { Application } from 'express';
import { ConfigKeys, type DatabaseConfig } from '../configurations';
import { RedisConnection } from '../lib/database/redis';

/**
 * @dependencies
 * - config-service plugin
 */
export async function redisPlugin(app: Application) {
  const { connectionString } = app.configService.get<DatabaseConfig>(ConfigKeys.Redis);

  const pubConnection = new RedisConnection({ connectionString, connectionName: 'pub' });
  const subConnection = new RedisConnection({ connectionString, connectionName: 'sub' });

  const redisPubConnection = pubConnection;
  const redisSubConnection = subConnection;

  await Promise.all([pubConnection.connect(), subConnection.connect()]); // const [pubClient, subClient] =

  app.redis.pub = redisPubConnection.getClient()!;
  app.redis.sub = redisSubConnection.getClient()!;
}
