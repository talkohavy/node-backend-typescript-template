import pg, { Client, QueryResultRow } from 'pg';

export class PostgresConnection {
  private static instance: PostgresConnection;
  private readonly dbClient: Client;

  private constructor(connectionString: string) {
    this.dbClient = new pg.Client(connectionString);
  }

  public static getInstance(connectionString?: string): PostgresConnection {
    if (!PostgresConnection.instance) {
      if (!connectionString) throw new Error('Database credentials are required for first initialization');

      PostgresConnection.instance = new PostgresConnection(connectionString);
    }
    return PostgresConnection.instance;
  }

  connect() {
    this.dbClient.connect((err) => {
      if (err) return console.error('Error connecting to PostgreSQL:', err);

      console.log('Successfully Connected to Postgres!');
    });
  }

  async disconnect() {
    try {
      await this.dbClient.end();
      console.log('Disconnected from PostgreSQL');
    } catch (error) {
      console.error('Error disconnecting from PostgreSQL:', error);
    }
  }

  // Should not exist! This is for testing purposes only!
  async query<T extends QueryResultRow = any>(sql: any, params?: any) {
    try {
      const result = await this.dbClient.query<T>(sql, params);

      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }
}
