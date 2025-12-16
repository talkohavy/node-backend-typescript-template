import type { CreateUserDto, UpdateUserDto } from '../../../users/services/interfaces/users.service.interface';
import type { DatabaseUser } from '../../../users/types';

export interface IUsersAdapter {
  createUser(data: CreateUserDto): Promise<DatabaseUser>;
  getUserById(userId: string): Promise<DatabaseUser>;
  getUsers(query?: any): Promise<Array<DatabaseUser>>;
  getUserByEmail(email: string): Promise<DatabaseUser | null>;
  updateUserById(userId: string, data: UpdateUserDto): Promise<DatabaseUser>;
  deleteUserById(userId: string): Promise<{ success: boolean }>;
}
