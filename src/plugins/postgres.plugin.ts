import type { Application } from 'express';
import { ConfigKeys, type PostgresConfig } from '../configurations';
import { PostgresConnection } from '../lib/database/postgres.connection';

/**
 * @dependencies
 * - config-service plugin
 */
export async function postgresPlugin(app: Application) {
  const { connectionString } = app.configService.get<PostgresConfig>(ConfigKeys.Postgres);

  const dbClient = PostgresConnection.getInstance(connectionString);

  await dbClient.connect();

  const pgClient = dbClient.getClient();

  app.pg = pgClient;
}
