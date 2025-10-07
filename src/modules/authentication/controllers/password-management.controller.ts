import { Application, Request, Response } from 'express';
import { logger } from '../../../core';
import { UnauthorizedError } from '../../../lib/Errors';
import { ControllerFactory } from '../../../lib/lucky-server';
import { joiBodyMiddleware } from '../../../middlewares/joi-body.middleware';
import { PasswordManagementService } from '../services/password-management.service';
import { getIsPasswordValidSchema } from './dto/get-is-password-valid.dto';

export class PasswordManagementController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly passwordManagementService: PasswordManagementService,
  ) {}

  private getIsPasswordValid() {
    this.app.post(
      '/auth/is-password-valid',
      joiBodyMiddleware(getIsPasswordValidSchema),
      async (req: Request, res: Response) => {
        try {
          logger.info('POST /auth/is-password-valid - check if password is valid');

          const { hashedPassword: saltAndHashedPassword, password } = req.body;

          const isValid = await this.passwordManagementService.getIsPasswordValid(saltAndHashedPassword, password);

          res.json({ isValid });
        } catch (error) {
          logger.error('Check password validity failed...', { error });

          throw new UnauthorizedError('Invalid credentials');
        }
      },
    );
  }

  attachRoutes() {
    this.getIsPasswordValid();
  }
}
