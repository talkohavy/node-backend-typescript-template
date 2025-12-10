import type { TokenGenerationService } from '../../../authentication/services/token-generation.service';
import type { CreateAccessTokenProps, CreateRefreshTokenProps } from './interfaces/token-generation.network.interface';

export class TokenGenerationNetworkService {
  constructor(private readonly tokenGenerationService: TokenGenerationService) {}

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
