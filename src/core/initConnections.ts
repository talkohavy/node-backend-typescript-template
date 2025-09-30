import { ConfigKeys, DatabaseConfig } from '../configurations';
import { MongodbConnection } from '../lib/database/mongo.connection';
import { configService } from './initConfigService';
// import { PostgresConnection } from '../lib/database/postgres.connection';

export async function initConnections() {
  const { connectionString } = configService.get<DatabaseConfig>(ConfigKeys.Database);

  // Initialize database connections
  const dbClient = MongodbConnection.getInstance(connectionString);
  await dbClient.connect();
  // const dbClient = PostgresConnection.getInstance(connectionString);
  // dbClient.connect();
}
