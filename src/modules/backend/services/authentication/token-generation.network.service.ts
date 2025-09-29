import { AuthenticationModule } from '../../../authentication';
import { CreateAccessTokenProps, CreateRefreshTokenProps } from './interfaces/token-generation.network.interface';

export class TokenGenerationNetworkService {
  private readonly tokenGenerationService =
    AuthenticationModule.getInstance().getAuthenticationService().tokenGenerationService;

  constructor() {}

  async createTokens(userId: string) {
    const data = await this.tokenGenerationService.createTokens(userId);

    return data;
  }
  async createAccessToken(props: CreateAccessTokenProps) {
    const data = await this.tokenGenerationService.createAccessToken(props);

    return data;
  }
  async createRefreshToken(props: CreateRefreshTokenProps) {
    const data = await this.tokenGenerationService.createRefreshToken(props);

    return data;
  }
}
