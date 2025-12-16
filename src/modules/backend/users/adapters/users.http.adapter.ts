import type { CreateUserDto, UpdateUserDto } from '../../../users/services/interfaces/users.service.interface';
import type { DatabaseUser } from '../../../users/types';
import type { HttpClient } from '../../logic/http-client';
import type { IUsersAdapter } from './users.adapter.interface';
import { API_URLS } from '../../../../common/constants';
import { ServiceNames } from '../../../../configurations';

export class UsersHttpAdapter implements IUsersAdapter {
  constructor(private readonly httpClient: HttpClient) {}

  async createUser(data: CreateUserDto): Promise<DatabaseUser> {
    return this.httpClient.post<DatabaseUser>({ serviceName: ServiceNames.Users, route: API_URLS.users, body: data });
  }

  async getUserById(userId: string): Promise<DatabaseUser> {
    const route = `${API_URLS.users}/${userId}`;
    return this.httpClient.get<DatabaseUser>({ serviceName: ServiceNames.Users, route: route });
  }

  async getUsers(query?: any): Promise<Array<DatabaseUser>> {
    return this.httpClient.get<Array<DatabaseUser>>({
      serviceName: ServiceNames.Users,
      route: API_URLS.users,
      options: { queryParams: query },
    });
  }

  async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    return this.httpClient.post<DatabaseUser | null>({
      serviceName: ServiceNames.Users,
      route: API_URLS.getUserByEmail,
      body: { email },
    });
  }

  async updateUserById(userId: string, data: UpdateUserDto): Promise<DatabaseUser> {
    const route = `${API_URLS.users}/${userId}`;
    return this.httpClient.patch<DatabaseUser>({ serviceName: ServiceNames.Users, route: route, body: data });
  }

  async deleteUserById(userId: string): Promise<{ success: boolean }> {
    const route = `${API_URLS.users}/${userId}`;
    return this.httpClient.delete<{ success: boolean }>({ serviceName: ServiceNames.Users, route: route });
  }
}
