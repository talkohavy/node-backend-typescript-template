import { Application, Request, Response } from 'express';
import { API_URLS } from '../../../common/constants';
import { logger } from '../../../core';
import { NotFoundError } from '../../../lib/Errors';
import { ControllerFactory } from '../../../lib/lucky-server';
import { joiBodyMiddleware } from '../../../middlewares/joi-body.middleware';
import { UserNotFoundError } from '../logic/users.errors';
import { UserUtilitiesService } from '../services/user-utilities.service';
import { getUserByEmailSchema } from './dto/get-user-by-email.dto';

export class UserUtilitiesController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly userUtilitiesService: UserUtilitiesService,
  ) {}

  private getUserByEmail() {
    this.app.post(
      API_URLS.getUserByEmail,
      joiBodyMiddleware(getUserByEmailSchema),
      async (req: Request, res: Response) => {
        try {
          const { body } = req;

          logger.info('POST /users/get-by-email - fetching user by email');

          const email = body.email!;
          const user = await this.userUtilitiesService.getUserByEmail(email);

          res.json(user);
        } catch (error: any) {
          if (error instanceof UserNotFoundError) {
            throw new NotFoundError(error.message);
          }

          throw error;
        }
      },
    );
  }

  attachRoutes() {
    this.getUserByEmail();
  }
}
