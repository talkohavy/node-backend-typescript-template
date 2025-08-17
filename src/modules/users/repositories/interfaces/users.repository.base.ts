import { DatabaseUser } from '../../types';
import {
  GetUserByIdOptions,
  GetUsersProps,
  CreateUserDto,
  UpdateUserDto,
  GetUserByEmailOptions,
} from './users.repository.interface';

export interface IUsersRepository {
  getUserByEmail(email: string, options?: GetUserByEmailOptions): Promise<DatabaseUser | null>;
  createUser(body: CreateUserDto): Promise<DatabaseUser>;
  getUsers(props?: GetUsersProps): Promise<Array<DatabaseUser>>;
  getUserById(userId: string, options?: GetUserByIdOptions): Promise<DatabaseUser | null>;
  updateUserById(userId: string, body: UpdateUserDto): Promise<DatabaseUser>;
  deleteUserById(userId: string): Promise<boolean>;
}
