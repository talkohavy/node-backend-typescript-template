import type { ConfigService } from '../../lib/config-service';
import type { RedisConfig } from '../../lib/database/redis';
import { ConfigKeys, type DatabaseConfig } from '../../configurations';
import { initPostgresqlConnection } from './initPostgresqlConnection';
import { initRedisConnection } from './initRedisConnection';
// import { initMongodbConnection } from './initMongodbConnection';

export async function initConnections(configService: ConfigService) {
  const { connectionString: dbConnection } = configService.get<DatabaseConfig>(ConfigKeys.Database);
  const { connectionString: redisConnectionString } = configService.get<RedisConfig>(ConfigKeys.Redis);

  // await initMongodbConnection(dbConnection);
  await initPostgresqlConnection(dbConnection);
  await initRedisConnection(redisConnectionString);
}
