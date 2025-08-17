import { DatabaseUser } from '../../../users/types';
import { getUsersModule } from '../../../users/users.module';
import { generateHashedPassword } from '../../controllers/users/logic/generateHashedPassword';

export class UsersCrudNetworkService {
  private readonly usersService = getUsersModule().getUsersService();

  constructor() {}

  async createUser(body: any): Promise<DatabaseUser | null> {
    const hashedPassword = await generateHashedPassword({ rawPassword: body.password, salt: 'some-salt' });

    const createUserPayload = {
      email: body.email,
      hashedPassword,
      nickname: body.nickname,
      dateOfBirth: body.dateOfBirth,
    };

    const data = await this.usersService.crudService.createUser(createUserPayload);

    return data;
  }

  async getUsers(queryParams?: Record<string, any>): Promise<DatabaseUser[]> {
    const data = await this.usersService.crudService.getUsers(queryParams);

    return data;
  }

  async getUserById(userId: string): Promise<DatabaseUser> {
    const data = await this.usersService.crudService.getUserById(userId);

    return data;
  }

  async updateUserById(userId: string, userData: Partial<DatabaseUser>): Promise<DatabaseUser> {
    const data = await this.usersService.crudService.updateUser(userId, userData);

    return data;
  }

  async deleteUserById(id: string): Promise<{ success: boolean }> {
    const data = await this.usersService.crudService.deleteUser(id);

    return data;
  }
}
