import jwt, { VerifyOptions } from 'jsonwebtoken';
import { ConfigKeys, configService, type JwtConfig } from '../../../configurations';

export class TokenVerificationService {
  constructor() {}

  async verifyToken(token: string): Promise<any> {
    const { accessSecret, issuer } = configService.get<JwtConfig>(ConfigKeys.Jwt);

    const options: VerifyOptions = { issuer };

    const decodedToken = (await new Promise((resolve, reject) => {
      jwt.verify(token, accessSecret, options, (error, decoded: any) => {
        if (error) return reject(error);

        resolve(decoded);
      });
    })) as any;

    return decodedToken;
  }
}
