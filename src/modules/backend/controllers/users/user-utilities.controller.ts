import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '../../../../lib/lucky-server';
import type { AuthenticationNetworkService } from '../../services/authentication/authentication.network.service';
import type { UsersNetworkService } from '../../services/users/users.network.service';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { logger } from '../../../../core';
import { extractTokenFromCookies } from '../../logic/extractTokenFromCookies';

export class UserUtilitiesController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly usersNetworkService: UsersNetworkService,
    private readonly authenticationNetworkService: AuthenticationNetworkService,
  ) {}

  private getProfile() {
    this.app.get(API_URLS.getProfile, async (req: Request, res: Response) => {
      logger.info(`GET ${API_URLS.getProfile} - get user profile`);

      const token = extractTokenFromCookies(req.cookies);

      const decodedToken = await this.authenticationNetworkService.tokenVerificationService.verifyToken(token);

      if (!decodedToken) return void res.status(StatusCodes.NO_CONTENT).json({}); // <--- silently fail

      const userId = decodedToken?.id;

      const fetchedUser = await this.usersNetworkService.crudService.getUserById(userId);

      res.json(fetchedUser);
    });
  }

  registerRoutes() {
    this.getProfile();
  }
}
