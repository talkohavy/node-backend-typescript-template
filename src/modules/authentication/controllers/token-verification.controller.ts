import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { TokenVerificationService } from '../services/token-verification.service';
import { API_URLS } from '../../../common/constants';
import { ConfigKeys, type CookiesConfig } from '../../../configurations';
import { logger, configService } from '../../../core';
import { UnauthorizedError } from '../../../lib/Errors';

export class TokenVerificationController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly tokenVerificationService: TokenVerificationService,
  ) {}

  private verifyToken() {
    this.app.get(API_URLS.verifyToken, async (req: Request, res: Response) => {
      logger.info(`GET ${API_URLS.verifyToken} - verify tokens`);

      const encodedToken = this.extractTokenFromCookies(req.cookies);

      if (!encodedToken) {
        logger.error('No token found in cookies');
        throw new UnauthorizedError('No token provided');
      }

      const decodedToken = await this.tokenVerificationService.verifyToken(encodedToken);

      res.json(decodedToken);
    });
  }

  private extractTokenFromCookies(cookies: any): string {
    const { accessCookie } = configService.get<CookiesConfig>(ConfigKeys.Cookies);
    const token = cookies[accessCookie.name] as string;

    return token;
  }

  attachRoutes() {
    this.verifyToken();
  }
}
