import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtConfig } from '../../../configurations/types';
import { configService } from '../../../lib/config/config.service';

type CreateRefreshTokenProps = {
  payload: Record<string, any>;
};

export async function createRefreshToken(props: CreateRefreshTokenProps): Promise<string> {
  const { payload } = props;

  const { refreshSecret, refreshExpireTime, issuer } = configService.get<JwtConfig>('jwt');

  const options: SignOptions = {
    expiresIn: refreshExpireTime as any,
    issuer,
    audience: payload.userID.toString(), // who this token is intended for (SPECIFICALLY!)
    header: { alg: 'HS256', typ: 'JWT' },
  };

  return new Promise((resolve, reject) => {
    jwt.sign(payload, refreshSecret, options, (error, token) => {
      if (error) return reject(new Error('500 InternalServerError'));

      resolve(token!);
    });
  });
}
