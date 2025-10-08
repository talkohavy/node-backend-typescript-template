import { RedisConnection } from '../../lib/database/redis';

export async function initRedisConnection(connectionString: string) {
  const pubConnection = new RedisConnection({ connectionString, connectionName: 'pub' });
  const subConnection = new RedisConnection({ connectionString, connectionName: 'sub' });

  const [pubClient, subClient] = await Promise.all([pubConnection.connect(), subConnection.connect()]);

  return { pubClient, subClient };
}
