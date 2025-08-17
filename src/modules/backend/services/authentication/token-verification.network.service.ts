import { getAuthenticationModule } from '../../../authentication/authentication.module';

export class TokenVerificationNetworkService {
  private readonly tokenVerificationService =
    getAuthenticationModule().getAuthenticationService().tokenVerificationService;

  constructor() {}

  async verifyToken(token: string) {
    const data = await this.tokenVerificationService.verifyToken(token);

    return data;
  }
}
