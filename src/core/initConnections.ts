import { ConfigKeys, DatabaseConfig } from '../configurations';
import { PostgresConnection } from '../lib/database/postgres.connection';
import { configService } from './initConfigService';
// import { MongodbConnection } from '../lib/database/mongo.connection';

export async function initConnections() {
  const { connectionString } = configService.get<DatabaseConfig>(ConfigKeys.Database);

  // Initialize database connections
  // const dbClient = MongodbConnection.getInstance(connectionString);
  // await dbClient.connect();
  const dbClient = PostgresConnection.getInstance(connectionString);
  await dbClient.connect();
}
