import { DatabaseUser } from '../../../users/types';
import { UsersModule } from '../../../users/users.module';

export class UserUtilitiesNetworkService {
  private readonly userUtilitiesService = UsersModule.getInstance().getUsersService().utilitiesService;

  constructor() {}

  async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const data = await this.userUtilitiesService.getUserByEmail(email);

    return data;
  }
}
