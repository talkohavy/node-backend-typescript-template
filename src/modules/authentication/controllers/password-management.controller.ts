import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { PasswordManagementService } from '../services/password-management.service';
import { API_URLS } from '../../../common/constants';
import { UnauthorizedError } from '../../../lib/Errors';
import { joiBodyMiddleware } from '../../../middlewares/joi-body.middleware';
import { getIsPasswordValidSchema } from './dto/get-is-password-valid.dto';

export class PasswordManagementController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly passwordManagementService: PasswordManagementService,
  ) {}

  private getIsPasswordValid() {
    this.app.post(
      API_URLS.isPasswordValid,
      joiBodyMiddleware(getIsPasswordValidSchema),
      async (req: Request, res: Response) => {
        try {
          this.app.logger.info(`POST ${API_URLS.isPasswordValid} - check if password is valid`);

          const { hashedPassword: saltAndHashedPassword, password } = req.body;

          const isValid = await this.passwordManagementService.getIsPasswordValid(saltAndHashedPassword, password);

          res.json({ isValid });
        } catch (error) {
          this.app.logger.error('Check password validity failed...', { error });

          throw new UnauthorizedError('Invalid credentials');
        }
      },
    );
  }

  registerRoutes() {
    this.getIsPasswordValid();
  }
}
