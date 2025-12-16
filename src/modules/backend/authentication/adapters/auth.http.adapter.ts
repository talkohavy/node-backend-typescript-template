import type { HttpClient } from '../../logic/http-client';
import type { IAuthAdapter, Tokens, DecodedToken } from './auth.adapter.interface';
import { API_URLS } from '../../../../common/constants';
import { ServiceNames } from '../../../../configurations';

export class AuthHttpAdapter implements IAuthAdapter {
  constructor(private readonly httpClient: HttpClient) {}

  async generateHashedPassword(rawPassword: string, salt: string): Promise<string> {
    return this.httpClient.post<string>({
      serviceName: ServiceNames.Auth,
      route: API_URLS.auth,
      body: { rawPassword, salt },
    });
  }

  async getIsPasswordValid(saltAndHashedPassword: string, rawPassword: string): Promise<boolean> {
    return this.httpClient.post<boolean>({
      serviceName: ServiceNames.Auth,
      route: API_URLS.isPasswordValid,
      body: { saltAndHashedPassword, rawPassword },
    });
  }

  async createTokens(userId: string): Promise<Tokens> {
    return this.httpClient.post<Tokens>({
      serviceName: ServiceNames.Auth,
      route: API_URLS.createTokens,
      body: { userId },
    });
  }

  async verifyToken(token: string): Promise<DecodedToken> {
    return this.httpClient.post<DecodedToken>({
      serviceName: ServiceNames.Auth,
      route: API_URLS.verifyToken,
      body: { token },
    });
  }
}
