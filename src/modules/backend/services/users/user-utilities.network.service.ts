import { DatabaseUser } from '../../../users/types';
import { getUsersModule } from '../../../users/users.module';

export class UserUtilitiesNetworkService {
  private readonly userUtilitiesService = getUsersModule().getUsersService().utilitiesService;

  constructor() {}

  async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const data = await this.userUtilitiesService.getUserByEmail(email);

    return data;
  }
}
