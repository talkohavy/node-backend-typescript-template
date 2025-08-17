import mongoose, { Model } from 'mongoose';
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

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    age: Number,
  },
  {
    timestamps: true,
  },
);

export class UsersMongoRepository implements IUsersRepository {
  private readonly UserModel: Model<any>;

  constructor(private readonly dbClient: MongodbConnection) {
    const mongoClient = this.dbClient.getClient();
    // Use the existing connection to create the model
    this.UserModel = mongoClient.models.User || mongoClient.model('User', userSchema);
  }

  async getUserByEmail(email: string, options: GetUserByEmailOptions = {}): Promise<DatabaseUser | null> {
    const projection = options.fields ? options.fields.join(' ') : '';
    const user = await this.UserModel.findOne({ email }, projection);

    return user ? this.transformMongoUser(user) : null;
  }

  async createUser(body: CreateUserDto): Promise<DatabaseUser> {
    const user = new this.UserModel(body);
    const savedUser = await user.save();

    return this.transformMongoUser(savedUser);
  }

  async getUsers(props?: GetUsersProps): Promise<Array<DatabaseUser>> {
    let query = this.UserModel.find(props?.filter || {});

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
    const user = await this.UserModel.findById(userId);
    return user ? this.transformMongoUser(user) : null;
  }

  async updateUserById(userId: string, body: UpdateUserDto): Promise<DatabaseUser> {
    const updatedUser = await this.UserModel.findByIdAndUpdate(userId, { $set: body }, { new: true });

    if (!updatedUser) throw new Error('User not found');
    return this.transformMongoUser(updatedUser);
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const result = await this.UserModel.findByIdAndDelete(userId);
    return !!result;
  }

  private transformMongoUser(mongoUser: any): DatabaseUser {
    return {
      id: mongoUser._id.toString(),
      email: mongoUser.email,
      password: mongoUser.password,
      name: mongoUser.name,
      age: mongoUser.age,
    };
  }
}
