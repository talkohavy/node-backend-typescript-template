import { Application, CookieOptions, Request, Response } from 'express';
import { StatusCodes } from '../../../../common/constants';
import { Config, CookiesConfig } from '../../../../configurations/types';
import { configService } from '../../../../lib/config/config.service';
import { ControllerFactory } from '../../../../lib/controller-factory';
<<<<<<< Updated upstream
import { BadRequestError } from '../../../../lib/Errors';
import { logger } from '../../../../lib/logger';
=======
import { logger } from '../../../../lib/loggerService';
>>>>>>> Stashed changes
import { joiBodyMiddleware } from '../../../../middlewares/joiBodyMiddleware';
import { UserNotFoundError } from '../../../users/logic/users.errors';
import { AuthenticationNetworkService } from '../../services/authentication/authentication.network.service';
import { UserUtilitiesNetworkService } from '../../services/users/user-utilities.network.service';
import { loginSchema } from './dto/loginSchema.dto';

export class AuthenticationController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly authenticationNetworkService: AuthenticationNetworkService,
    private readonly userUtilitiesNetworkService: UserUtilitiesNetworkService,
  ) {}

  private login() {
    this.app.post('/auth/login', joiBodyMiddleware(loginSchema), async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;

        logger.info('POST /auth/login - user login endpoint');

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
    this.app.get('/users/logout', async (_req, res) => {
      logger.info('GET /users/logout - user logout');

      const { accessCookie, refreshCookie } = configService.get<CookiesConfig>('cookies');

      res.clearCookie(accessCookie.name);
      res.clearCookie(refreshCookie.name);

      res.json({});
    });
  }

  attachRoutes() {
    this.login();
    this.logout();
  }
}
