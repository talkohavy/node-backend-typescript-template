import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from '../../../../common/constants';
import { logger } from '../../../../lib/logger';
import { AuthenticationService } from '../../../authentication/services/authentication.service';

export class AuthMiddleware {
  constructor(private readonly authService: AuthenticationService) {}

  /**
   * Middleware to verify user authentication
   * Sets req.user if token is valid, otherwise returns 401
   */
  requireAuth() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.headers['to-do-token'] as string;

        const decodedToken = await this.authService.tokenVerificationService.verifyToken(token);
        (req as any).user = decodedToken;
        next();
      } catch (error) {
        logger.error('Authentication failed:', error);
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Authentication required',
        });
      }
    };
  }

  /**
   * Middleware to optionally verify user authentication
   * Sets req.user if token is valid, continues regardless
   */
  optionalAuth() {
    return async (req: Request, _res: Response, next: NextFunction) => {
      try {
        const token = req.headers['to-do-token'] as string;
        const decodedToken = await this.authService.tokenVerificationService.verifyToken(token);
        (req as any).user = decodedToken;
      } catch (_error) {
        // Silent fail for optional auth
        (req as any).user = null;
      }
      next();
    };
  }
}
