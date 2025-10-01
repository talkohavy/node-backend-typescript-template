import { ConfigKeys, DatabaseConfig } from '../configurations';
import { ConfigService } from '../lib/config-service';
import { PostgresConnection } from '../lib/database/postgres.connection';
// import { MongodbConnection } from '../lib/database/mongo.connection';

export async function initConnections(configService: ConfigService) {
  const { connectionString } = configService.get<DatabaseConfig>(ConfigKeys.Database);

  // Initialize database connections
  // const dbClient = MongodbConnection.getInstance(connectionString);
  const dbClient = PostgresConnection.getInstance(connectionString);
  await dbClient.connect();
}
