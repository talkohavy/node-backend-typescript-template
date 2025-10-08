import { PostgresConnection } from '../../lib/database/postgres.connection';

export async function initPostgresqlConnection(postgresqlConnection: string) {
  const dbClient = PostgresConnection.getInstance(postgresqlConnection);

  await dbClient.connect();
}
