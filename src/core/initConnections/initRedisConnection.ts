import { RedisConnection } from '../../lib/database/redis';

export let redisPubConnection: RedisConnection = {} as RedisConnection;
export let redisSubConnection: RedisConnection = {} as RedisConnection;

export async function initRedisConnection(connectionString: string) {
  const pubConnection = new RedisConnection({ connectionString, connectionName: 'pub' });
  const subConnection = new RedisConnection({ connectionString, connectionName: 'sub' });

  redisPubConnection = pubConnection;
  redisSubConnection = subConnection;

  await Promise.all([pubConnection.connect(), subConnection.connect()]); // const [pubClient, subClient] =
}
