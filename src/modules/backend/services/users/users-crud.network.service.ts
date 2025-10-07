import crypto from 'node:crypto';
import { UsersModule, type DatabaseUser } from '../../../users';
import { CreateUserDto } from '../../../users/services/interfaces/users.service.interface';
import { generateHashedPassword } from '../../controllers/users/logic/generateHashedPassword';

export class UsersCrudNetworkService {
  private readonly usersService = UsersModule.getInstance().getUsersCrudService();

  constructor() {}

  async createUser(body: any): Promise<DatabaseUser | null> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await generateHashedPassword({ rawPassword: body.password, salt });

    const createUserPayload: CreateUserDto = {
      email: body.email,
      password: `${salt}:${hashedPassword}`,
      nickname: body.nickname,
      dateOfBirth: body.dateOfBirth,
    };

    const data = await this.usersService.createUser(createUserPayload);

    return data;
  }

  async getUsers(queryParams?: Record<string, any>): Promise<DatabaseUser[]> {
    const data = await this.usersService.getUsers(queryParams);

    return data;
  }

  async getUserById(userId: string): Promise<DatabaseUser> {
    const data = await this.usersService.getUserById(userId);

    return data;
  }

  async updateUserById(userId: string, userData: Partial<DatabaseUser>): Promise<DatabaseUser> {
    const data = await this.usersService.updateUserById(userId, userData);

    return data;
  }

  async deleteUserById(id: string): Promise<{ success: boolean }> {
    const data = await this.usersService.deleteUserById(id);

    return data;
  }
}
