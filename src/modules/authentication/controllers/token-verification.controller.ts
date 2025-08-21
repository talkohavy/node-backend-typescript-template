import { Application, Request, Response } from 'express';
import { CookiesConfig } from '../../../configurations/types';
import { configService } from '../../../lib/config/config.service';
import { ControllerFactory } from '../../../lib/controller-factory';
import { UnauthorizedError } from '../../../lib/Errors';
import { logger } from '../../../lib/loggerService';
import { TokenVerificationService } from '../services/token-verification.service';

export class TokenVerificationController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly tokenVerificationService: TokenVerificationService,
  ) {}

  private verifyToken() {
    this.app.get('/auth/verify-token', async (req: Request, res: Response) => {
      logger.info('GET /auth/verify-token - verify tokens');

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
    const { accessCookie } = configService.get<CookiesConfig>('cookies');
    const token = cookies[accessCookie.name] as string;

    return token;
  }

  attachRoutes() {
    this.verifyToken();
  }
}
