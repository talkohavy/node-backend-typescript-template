import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtConfig } from '../../../configurations/types';
import { configService } from '../../../lib/config/config.service';

type CreateAccessTokenProps = {
  payload: Record<string, any>;
};

export async function createAccessToken(props: CreateAccessTokenProps): Promise<string> {
  const { payload } = props;

  const { accessSecret, accessExpireTime, issuer } = configService.get<JwtConfig>('jwt');

  const options: SignOptions = {
    expiresIn: accessExpireTime as any,
    issuer, // <--- issuer should be defined either here or inside the payload as { iss: 'lkybe' }. YOU CANNOT DO BOTH! Having both will cause an error!
    audience: payload.userID.toString(), // who this token is intended for (SPECIFICALLY!)
    header: { alg: 'HS256', typ: 'JWT' },
  };

  return new Promise((resolve, reject) => {
    jwt.sign(payload, accessSecret, options, (error, token) => {
      if (error) return reject(new Error('something went wrong'));

      resolve(token!);
    });
  });
}
