import jwt, { VerifyOptions } from 'jsonwebtoken';
import { JwtConfig } from '../../../configurations/types';
import { configService } from '../../../lib/config/config.service';

export class TokenVerificationService {
  constructor() {}

  async verifyToken(token: string): Promise<any> {
    const { accessSecret, issuer } = configService.get<JwtConfig>('jwt');

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
