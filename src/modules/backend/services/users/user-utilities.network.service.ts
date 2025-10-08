import type { DatabaseUser } from '../../../users/types';
import { UsersModule } from '../../../users';

export class UserUtilitiesNetworkService {
  private readonly userUtilitiesService = UsersModule.getInstance().getUserUtilitiesService();

  constructor() {}

  async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const data = await this.userUtilitiesService.getUserByEmail(email);

    return data;
  }
}
