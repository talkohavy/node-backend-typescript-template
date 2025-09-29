import { AuthenticationModule } from '../../../authentication';

export class TokenVerificationNetworkService {
  private readonly tokenVerificationService =
    AuthenticationModule.getInstance().getAuthenticationService().tokenVerificationService;

  constructor() {}

  async verifyToken(token: string) {
    const data = await this.tokenVerificationService.verifyToken(token);

    return data;
  }
}
