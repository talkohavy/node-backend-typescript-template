import { UserModel } from '../../../database/mongo/models/user/user.model';
import { MongodbConnection } from '../../../lib/database/mongo.connection';
import { DatabaseUser } from '../types';
import { IUsersRepository } from './interfaces/users.repository.base';
import {
  GetUserByIdOptions,
  GetUsersProps,
  CreateUserDto,
  UpdateUserDto,
  GetUserByEmailOptions,
} from './interfaces/users.repository.interface';

export class UsersMongoRepository implements IUsersRepository {
  constructor() {
    MongodbConnection.getInstance().ensureConnected();
  }

  async getUserByEmail(email: string, options: GetUserByEmailOptions = {}): Promise<DatabaseUser | null> {
    const projection = options.fields ? options.fields.join(' ') : '';
    const user = await UserModel.findOne({ email }, projection);

    return user ? this.transformMongoUser(user) : null;
  }

  async createUser(body: CreateUserDto): Promise<DatabaseUser> {
    const user = new UserModel(body);
    const savedUser = await user.save();

    return this.transformMongoUser(savedUser);
  }

  async getUsers(props?: GetUsersProps): Promise<Array<DatabaseUser>> {
    let query = UserModel.find(props?.filter || {});

    if (props?.options?.skip) {
      query = query.skip(props.options.skip);
    }

    if (props?.options?.limit) {
      query = query.limit(props.options.limit);
    }

    if (props?.options?.sort) {
      // Convert the sort object to mongoose format
      const sortObj: Record<string, 1 | -1> = {};
      Object.entries(props.options.sort).forEach(([key, value]) => {
        sortObj[key] = value as 1 | -1;
      });
      query = query.sort(sortObj);
    }

    const users = await query.exec();
    return users.map((user: any) => this.transformMongoUser(user));
  }

  async getUserById(userId: string, _options: GetUserByIdOptions = {}): Promise<DatabaseUser | null> {
    const user = await UserModel.findById(userId);
    return user ? this.transformMongoUser(user) : null;
  }

  async updateUserById(userId: string, body: UpdateUserDto): Promise<DatabaseUser> {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: body }, { new: true });

    if (!updatedUser) throw new Error('User not found');
    return this.transformMongoUser(updatedUser);
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(userId);
    return !!result;
  }

  private transformMongoUser(mongoUser: any): DatabaseUser {
    return {
      id: mongoUser._id.toString(),
      email: mongoUser.email,
      hashed_password: mongoUser.hashed_password,
      nickname: mongoUser.nickname,
      date_of_birth: mongoUser.dateOfBirth,
    };
  }
}
