import { Application, NextFunction, Response, Request } from 'express';
import { Config } from '../../../configurations/types';
import { configService } from '../../../lib/config/config.service';
import { UnauthorizedError } from '../../../lib/Errors';
import { logger } from '../../../lib/logger';
import { verifyToken } from '../logic/verifyToken';

export class UsersMiddleware {
  app: Application;

  public constructor(app = {} as Application) {
    this.app = app;
  }

  public use() {
    this.app.use('/users', (_req: Request, _res: Response, next: NextFunction) => {
      console.log('Users middleware');

      next();
    });
  }

  public async authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
    console.log('Authentication middleware for users');

    try {
      const { cookies, jwt: jwtConfig } = configService.get<Config>('');
      const { accessCookie } = cookies;
      const { accessSecret, issuer } = jwtConfig;

      const token = req.cookies[accessCookie.name];

      if (!token) throw new UnauthorizedError('No access token provided');

      const decodedToken = await verifyToken({ token, secret: accessSecret, issuer });

      req.user = decodedToken;

      next();
    } catch (error) {
      logger.error('Authentication failed', { error });

      throw new UnauthorizedError('Authentication failed');
    }
  }
}
