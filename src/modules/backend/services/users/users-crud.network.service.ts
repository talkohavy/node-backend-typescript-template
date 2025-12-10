import crypto from 'node:crypto';
import type { DatabaseUser } from '../../../users';
import type { CreateUserDto } from '../../../users/services/interfaces/users.service.interface';
import type { UsersCrudService } from '../../../users/services/users-crud.service';
import { generateHashedPassword } from '../../controllers/users/logic/generateHashedPassword';

export class UsersCrudNetworkService {
  constructor(private readonly usersCrudService: UsersCrudService) {}

  async createUser(body: any): Promise<DatabaseUser | null> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await generateHashedPassword({ rawPassword: body.password, salt });

    const createUserPayload: CreateUserDto = {
      email: body.email,
      password: `${salt}:${hashedPassword}`,
      nickname: body.nickname,
      dateOfBirth: body.dateOfBirth,
    };

    const data = await this.usersCrudService.createUser(createUserPayload);

    return data;
  }

  async getUsers(queryParams?: Record<string, any>): Promise<DatabaseUser[]> {
    const data = await this.usersCrudService.getUsers(queryParams);

    return data;
  }

  async getUserById(userId: string): Promise<DatabaseUser> {
    const data = await this.usersCrudService.getUserById(userId);

    return data;
  }

  async updateUserById(userId: string, userData: Partial<DatabaseUser>): Promise<DatabaseUser> {
    const data = await this.usersCrudService.updateUserById(userId, userData);

    return data;
  }

  async deleteUserById(id: string): Promise<{ success: boolean }> {
    const data = await this.usersCrudService.deleteUserById(id);

    return data;
  }
}
