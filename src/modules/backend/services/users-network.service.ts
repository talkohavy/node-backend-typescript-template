import { DatabaseUser } from '../../users/types';
import { getUsersModule } from '../../users/users.module';

export class UsersNetworkService {
  private readonly usersModule = getUsersModule();

  constructor() {}

  async createUser(body: any): Promise<DatabaseUser | null> {
    const data = await this.usersModule.getUsersService().crudService.createUser(body);

    return data;
  }

  async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const data = await this.usersModule.getUsersService().utilitiesService.getUserByEmail(email);

    return data;
  }

  async getUsers(queryParams?: Record<string, any>): Promise<DatabaseUser[]> {
    const data = await this.usersModule.getUsersService().crudService.getUsers(queryParams);

    return data;
  }

  async getUserById(userId: string): Promise<DatabaseUser> {
    const data = await this.usersModule.getUsersService().crudService.getUserById(userId);

    return data;
  }

  async deleteUser(id: string): Promise<{ success: boolean }> {
    const data = await this.usersModule.getUsersService().crudService.deleteUser(id);

    return data;
  }
}
