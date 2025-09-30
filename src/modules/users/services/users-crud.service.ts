import { UserNotFoundError } from '../logic/users.errors';
import { createNewUserPayload } from '../logic/utils/createNewUserPayload';
import { IUsersRepository } from '../repositories/interfaces/users.repository.base';
import { DatabaseUser } from '../types';
import { CreateUserDto, UpdateUserDto } from './interfaces/users.service.interface';

export class UsersCrudService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async createUser(userData: CreateUserDto): Promise<DatabaseUser> {
    const newUserPayload = createNewUserPayload(userData);

    const createdUser = await this.usersRepository.createUser(newUserPayload);

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

  async updateUserById(userId: string, userData: UpdateUserDto): Promise<DatabaseUser> {
    const updatedUser = await this.usersRepository.updateUserById(userId, userData);

    return updatedUser;
  }

  async deleteUserById(userId: string): Promise<{ success: boolean }> {
    try {
      await this.usersRepository.deleteUserById(userId);
      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
