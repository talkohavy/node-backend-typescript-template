import type { UserUtilitiesService } from '../../../users/services/user-utilities.service';
import type { DatabaseUser } from '../../../users/types';

export class UserUtilitiesNetworkService {
  constructor(private readonly userUtilitiesService: UserUtilitiesService) {}

  async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const data = await this.userUtilitiesService.getUserByEmail(email);

    return data;
  }
}
