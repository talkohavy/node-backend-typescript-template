import type { PasswordManagementService } from '../../../authentication/services/password-management.service';
import type { GenerateHashedPasswordProps } from './interfaces/password-management.network.interface';

export class PasswordManagementNetworkService {
  constructor(private readonly passwordManagementService: PasswordManagementService) {}

  async generateHashedPassword(props: GenerateHashedPasswordProps): Promise<string> {
    const data = await this.passwordManagementService.generateHashedPassword(props);

    return data;
  }

  async getIsPasswordValid(saltAndHashedPassword: string, rawPassword: string): Promise<boolean> {
    const data = await this.passwordManagementService.getIsPasswordValid(saltAndHashedPassword, rawPassword);

    return data;
  }
}
