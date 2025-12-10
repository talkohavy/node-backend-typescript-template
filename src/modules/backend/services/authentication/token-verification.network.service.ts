import type { TokenVerificationService } from '../../../authentication/services/token-verification.service';

export class TokenVerificationNetworkService {
  constructor(private readonly tokenVerificationService: TokenVerificationService) {}

  async verifyToken(token: string) {
    const data = await this.tokenVerificationService.verifyToken(token);

    return data;
  }
}
