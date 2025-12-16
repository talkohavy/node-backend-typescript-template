import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '../../../../lib/lucky-server';
import type { IAuthAdapter } from '../../adapters/interfaces/auth.adapter.interface';
import type { IUsersAdapter } from '../../adapters/interfaces/users.adapter.interface';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { extractAccessTokenFromCookies } from '../../logic/extractAccessTokenFromCookies';

export class UserUtilitiesController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly usersAdapter: IUsersAdapter,
    private readonly authAdapter: IAuthAdapter,
  ) {}

  private getProfile() {
    this.app.get(API_URLS.getProfile, async (req: Request, res: Response) => {
      this.app.logger.info(`GET ${API_URLS.getProfile} - get user profile`);

      const token = extractAccessTokenFromCookies(req.cookies);

      const decodedToken = await this.authAdapter.verifyToken(token);

      if (!decodedToken) return void res.status(StatusCodes.NO_CONTENT).json({}); // <--- silently fail

      const userId = decodedToken?.id;

      const fetchedUser = await this.usersAdapter.getUserById(userId);

      res.json(fetchedUser);
    });
  }

  registerRoutes() {
    this.getProfile();
  }
}
