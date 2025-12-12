import type { Application, CookieOptions, Request, Response } from 'express';
import type { ControllerFactory } from '../../../../lib/lucky-server';
import type { AuthenticationNetworkService } from '../../services/authentication/authentication.network.service';
import type { UserUtilitiesNetworkService } from '../../services/users/user-utilities.network.service';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { ConfigKeys, type CookiesConfig, type Config } from '../../../../configurations';
import { logger, configService } from '../../../../core';
import { BadRequestError } from '../../../../lib/Errors';
import { joiBodyMiddleware } from '../../../../middlewares/joi-body.middleware';
import { UserNotFoundError } from '../../../users/logic/users.errors';
import { loginSchema } from './dto/loginSchema.dto';

export class AuthenticationController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly authenticationNetworkService: AuthenticationNetworkService,
    private readonly userUtilitiesNetworkService: UserUtilitiesNetworkService,
  ) {}

  private login() {
    this.app.post(API_URLS.authLogin, joiBodyMiddleware(loginSchema), async (req: Request, res: Response) => {
      try {
        logger.info(`POST ${API_URLS.authLogin} - user login endpoint`);

        const { email, password } = req.body;

        // Step 1: Get user by email
        const user = await this.userUtilitiesNetworkService.getUserByEmail(email);
        if (!user) {
          return void res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }

        // Step 2: Validate password
        const isValid = await this.authenticationNetworkService.passwordManagementService.getIsPasswordValid(
          user.hashed_password,
          password,
        );

        if (!isValid) {
          return void res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        }

        // Step 3: Generate tokens
        const tokens = await this.authenticationNetworkService.tokenGenerationService.createTokens(user.id.toString());

        // Step 4: Set cookies
        const { cookies, isDev } = configService.get<Config>('');
        const { name: accessTokenCookieName, maxAge } = cookies.accessCookie;
        const { name: refreshTokenCookieName } = cookies.refreshCookie;

        const options: CookieOptions = {
          secure: !isDev,
          httpOnly: true,
          domain: isDev ? undefined : '.luckylove.co.il',
          path: '/',
          maxAge,
          sameSite: 'strict',
        };

        res.cookie(accessTokenCookieName, tokens.accessToken, options);
        res.cookie(refreshTokenCookieName, tokens.refreshToken, options);

        res.json(user);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          logger.error('User not found:', error);
          throw new BadRequestError('invalid credentials');
        }

        throw error;
      }
    });
  }

  private logout() {
    this.app.get(API_URLS.authLogout, async (_req, res) => {
      logger.info(`GET ${API_URLS.authLogout} - user logout`);

      const { accessCookie, refreshCookie } = configService.get<CookiesConfig>(ConfigKeys.Cookies);

      res.clearCookie(accessCookie.name);
      res.clearCookie(refreshCookie.name);

      res.json({});
    });
  }

  registerRoutes() {
    this.login();
    this.logout();
  }
}
