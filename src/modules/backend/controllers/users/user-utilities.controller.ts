import { Application, Request, Response } from 'express';
import { StatusCodes } from '../../../../common/constants';
import { ControllerFactory } from '../../../../lib/controller-factory';
import { logger } from '../../../../lib/logger';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { UsersService } from '../../../users/services/users.service';
import { extractTokenFromCookies } from '../../logic/extractTokenFromCookies';

export class UserUtilitiesController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  private getProfile() {
    this.app.get('/users-service/users/get-profile', async (req: Request, res: Response) => {
      logger.info(`GET /users-service/users/get-profile - get user profile`);

      const token = extractTokenFromCookies(req.cookies);

      const decodedToken = await this.authenticationService.tokenVerificationService.verifyToken(token);

      if (!decodedToken) return void res.status(StatusCodes.NO_CONTENT).json({}); // <--- silently fail

      const userId = decodedToken?.id;

      const fetchedUser = await this.usersService.crudService.getUserById(userId);

      res.json(fetchedUser);
    });
  }

  attachRoutes() {
    this.getProfile();
  }
}
