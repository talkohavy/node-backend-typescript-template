import { UsersModule } from '../../../users';
import { DatabaseUser } from '../../../users/types';

export class UserUtilitiesNetworkService {
  private readonly userUtilitiesService = UsersModule.getInstance().getUserUtilitiesService();

  constructor() {}

  async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const data = await this.userUtilitiesService.getUserByEmail(email);

    return data;
  }
}
