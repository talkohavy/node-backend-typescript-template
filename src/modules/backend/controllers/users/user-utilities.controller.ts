import { Application, Request, Response } from 'express';
import { StatusCodes } from '../../../../common/constants';
import { logger } from '../../../../configurations';
import { ControllerFactory } from '../../../../lib/controller-factory';
import { extractTokenFromCookies } from '../../logic/extractTokenFromCookies';
import { AuthenticationNetworkService } from '../../services/authentication/authentication.network.service';
import { UsersNetworkService } from '../../services/users/users.network.service';

export class UserUtilitiesController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly usersNetworkService: UsersNetworkService,
    private readonly authenticationNetworkService: AuthenticationNetworkService,
  ) {}

  private getProfile() {
    this.app.get('/users-service/users/get-profile', async (req: Request, res: Response) => {
      logger.info(`GET /users-service/users/get-profile - get user profile`);

      const token = extractTokenFromCookies(req.cookies);

      const decodedToken = await this.authenticationNetworkService.tokenVerificationService.verifyToken(token);

      if (!decodedToken) return void res.status(StatusCodes.NO_CONTENT).json({}); // <--- silently fail

      const userId = decodedToken?.id;

      const fetchedUser = await this.usersNetworkService.crudService.getUserById(userId);

      res.json(fetchedUser);
    });
  }

  attachRoutes() {
    this.getProfile();
  }
}
