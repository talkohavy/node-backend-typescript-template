import jwt, { SignOptions } from 'jsonwebtoken';
import { ConfigKeys, type JwtConfig } from '../../../configurations';
import { configService } from '../../../core';
import { CreateAccessTokenProps, CreateRefreshTokenProps } from './interfaces/token-generation.interface';

export class TokenGenerationService {
  constructor() {}

  async createTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { id: userId };
    const accessToken = await this.createAccessToken({ payload });
    const refreshToken = await this.createRefreshToken({ payload });

    return { accessToken, refreshToken };
  }

  async createAccessToken(props: CreateAccessTokenProps): Promise<string> {
    const { payload } = props;

    const { accessSecret, accessExpireTime, issuer } = configService.get<JwtConfig>(ConfigKeys.Jwt);

    const options: SignOptions = {
      expiresIn: accessExpireTime as any,
      issuer, // <--- issuer should be defined either here or inside the payload as { iss: 'lkybe' }. YOU CANNOT DO BOTH! Having both will cause an error!
      audience: payload.id.toString(), // who this token is intended for (SPECIFICALLY!)
      header: { alg: 'HS256', typ: 'JWT' },
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, accessSecret, options, (error, token) => {
        if (error) return reject(new Error('something went wrong'));

        resolve(token!);
      });
    });
  }

  async createRefreshToken(props: CreateRefreshTokenProps): Promise<string> {
    const { payload } = props;

    const { refreshSecret, refreshExpireTime, issuer } = configService.get<JwtConfig>(ConfigKeys.Jwt);

    const options: SignOptions = {
      expiresIn: refreshExpireTime as any,
      issuer,
      audience: payload.id.toString(), // who this token is intended for (SPECIFICALLY!)
      header: { alg: 'HS256', typ: 'JWT' },
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, refreshSecret, options, (error, token) => {
        if (error) return reject(new Error('500 InternalServerError'));

        resolve(token!);
      });
    });
  }
}
