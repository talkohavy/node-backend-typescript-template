import { getAuthenticationModule } from '../../../authentication/authentication.module';
import { GenerateHashedPasswordProps } from './interfaces/password-management.network.interface';

export class PasswordManagementNetworkService {
  private readonly passwordManagementService =
    getAuthenticationModule().getAuthenticationService().passwordManagementService;

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
