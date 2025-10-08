import { ConfigKeys, DatabaseConfig } from '../../configurations';
import { ConfigService } from '../../lib/config-service';
import { RedisConfig } from '../../lib/database/redis';
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
