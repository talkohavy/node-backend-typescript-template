import type { Application } from 'express';
import { ConfigKeys, type DatabaseConfig } from '../configurations';
import { PostgresConnection } from '../lib/database/postgres.connection';

/**
 * @dependencies
 * - config-service plugin
 */
export async function postgresPlugin(app: Application) {
  const { connectionString } = app.configService.get<DatabaseConfig>(ConfigKeys.Database);

  const dbClient = PostgresConnection.getInstance(connectionString);

  await dbClient.connect();

  app.pg = dbClient.getClient();
}
