import { UserNotFoundError } from '../logic/users.errors';
import { IUsersRepository } from '../repositories/interfaces/users.repository.base';
import { DatabaseUser } from '../types';
import { CreateUserDto, UpdateUserDto } from './interfaces/users.service.interface';

export class UsersCrudService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async createUser(userData: CreateUserDto): Promise<DatabaseUser> {
    const createdUser = await this.usersRepository.createUser(userData);

    return createdUser;
  }

  async getUserById(userId: string): Promise<DatabaseUser> {
    const user = await this.usersRepository.getUserById(userId);

    if (!user) throw new UserNotFoundError(userId);

    return user;
  }

  async getUsers(_query?: any): Promise<Array<DatabaseUser>> {
    return this.usersRepository.getUsers();
  }

  async updateUser(userId: string, user: UpdateUserDto): Promise<DatabaseUser> {
    const existingUser = await this.usersRepository.getUserById(userId);

    if (!existingUser) throw new UserNotFoundError(userId);

    const updatedUser = { ...existingUser, ...user } as DatabaseUser;

    await this.usersRepository.updateUserById(userId, updatedUser);

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<{ success: boolean }> {
    try {
      await this.usersRepository.deleteUserById(userId);
      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
