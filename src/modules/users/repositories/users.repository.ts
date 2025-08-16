import { PostgresConnection } from '../../../lib/database/postgres.connection';
import { DatabaseUser } from '../types';
import { GetUserByIdOptions, GetUsersProps } from './interfaces/users.repository.interface';

export class UsersRepository {
  constructor(private readonly dbClient: PostgresConnection) {}

  async createUser(body: Partial<DatabaseUser>) {
    const userResult = (await this.dbClient.create(body)) as DatabaseUser;

    return userResult;
  }

  async getUsers(props?: GetUsersProps): Promise<Array<DatabaseUser>> {
    const usersResult = await this.dbClient.findMany(props);

    return usersResult;
  }

  async getUserById(userId: string, options: GetUserByIdOptions = {}): Promise<DatabaseUser | null> {
    const userResult = (await this.dbClient.findById(userId, options)) as DatabaseUser | null;

    return userResult;
  }

  async updateUserById(userId: string, body: any): Promise<DatabaseUser> {
    const queryStatement = { _id: userId };
    const updateStatement = { update: body };

    const updatedUser = await this.dbClient.updateMany(queryStatement, updateStatement);

    return updatedUser;
  }

  async deleteUserById(userId: string): Promise<any> {
    const result = await this.dbClient.deleteOne({ _id: userId });

    return result;
  }
}
