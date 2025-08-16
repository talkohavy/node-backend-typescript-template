import { DatabaseUser } from '../../types';
import { GetUserByIdOptions, GetUsersProps, CreateUserDto, UpdateUserDto } from './users.repository.interface';

export interface IUsersRepository {
  createUser(body: CreateUserDto): Promise<DatabaseUser>;
  getUsers(props?: GetUsersProps): Promise<Array<DatabaseUser>>;
  getUserById(userId: string, options?: GetUserByIdOptions): Promise<DatabaseUser | null>;
  updateUserById(userId: string, body: UpdateUserDto): Promise<DatabaseUser>;
  deleteUserById(userId: string): Promise<boolean>;
}
