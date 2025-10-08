import { MongodbConnection } from '../../lib/database/mongo.connection';

export async function initMongodbConnection(mongodbConnection: string) {
  const dbClient = MongodbConnection.getInstance(mongodbConnection);

  await dbClient.connect();
}
