import type { GenerateHashedPasswordProps } from './interfaces/password-management.network.interface';
import { AuthenticationModule } from '../../../authentication';

export class PasswordManagementNetworkService {
  private readonly passwordManagementService =
    AuthenticationModule.getInstance().getAuthenticationService().passwordManagementService;

  constructor() {}

  async generateHashedPassword(props: GenerateHashedPasswordProps): Promise<string> {
    const data = await this.passwordManagementService.generateHashedPassword(props);

    return data;
  }

  async getIsPasswordValid(saltAndHashedPassword: string, rawPassword: string): Promise<boolean> {
    const data = await this.passwordManagementService.getIsPasswordValid(saltAndHashedPassword, rawPassword);

    return data;
  }
}
