import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '../../../../lib/lucky-server';
import type { IAuthAdapter } from '../../authentication/adapters/auth.adapter.interface';
import type { IUsersAdapter } from '../adapters/users.adapter.interface';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { ConfigKeys, type CookiesConfig } from '../../../../configurations';
import { ForbiddenError, UnauthorizedError } from '../../../../lib/Errors';
import { joiBodyMiddleware } from '../../../../middlewares/joi-body.middleware';
import { createUserSchema } from './dto/createUserSchema.dto';
import { updateUserSchema } from './dto/updateUserSchema.dto';

export class UsersCrudController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly usersAdapter: IUsersAdapter,
    private readonly authAdapter: IAuthAdapter,
  ) {}

  private createUser() {
    this.app.post(API_URLS.users, joiBodyMiddleware(createUserSchema), async (req: Request, res: Response) => {
      const { body } = req;

      this.app.logger.info(`POST ${API_URLS.users} - create new user`);

      const user = await this.usersAdapter.createUser(body);

      res.status(StatusCodes.CREATED).json(user);
    });
  }

  private getUsers() {
    this.app.get(API_URLS.users, async (req: Request, res: Response) => {
      const { query } = req;

      this.app.logger.info(`GET ${API_URLS.users} - get all users`);

      const users = await this.usersAdapter.getUsers(query);

      res.json(users);
    });
  }

  private getUserById() {
    this.app.get(API_URLS.userById, async (req: Request, res: Response) => {
      const userId = req.params.userId! as string;

      this.app.logger.info(`GET ${API_URLS.userById} - get user by id`);

      const fetchedUser = await this.usersAdapter.getUserById(userId);

      res.json(fetchedUser);
    });
  }

  private updateUser() {
    this.app.patch(API_URLS.userById, joiBodyMiddleware(updateUserSchema), async (req: Request, res: Response) => {
      this.app.logger.info(`PATCH ${API_URLS.userById} - updating user by ID`);

      const token = this.extractAccessTokenFromCookies(req.cookies);

      const decodedToken = await this.authAdapter.verifyToken(token);

      if (!decodedToken) throw new UnauthorizedError();

      const userId = req.params.userId!;

      if (decodedToken.id !== userId) throw new ForbiddenError();

      const userData = req.body;
      const updatedUser = await this.usersAdapter.updateUserById(userId, userData);

      res.json(updatedUser);
    });
  }

  private deleteUser() {
    this.app.delete(API_URLS.userById, async (req: Request, res: Response) => {
      const id = req.params.userId!;

      this.app.logger.info(`DELETE ${API_URLS.userById} - delete user`);

      const token = this.extractAccessTokenFromCookies(req.cookies);

      const decodedToken = await this.authAdapter.verifyToken(token);

      if (!decodedToken) throw new UnauthorizedError();

      if (decodedToken.id !== id) throw new ForbiddenError();

      const result = await this.usersAdapter.deleteUserById(id);

      res.json(result);
    });
  }

  private extractAccessTokenFromCookies(cookies: any): string {
    const { accessCookie } = this.app.configService.get<CookiesConfig>(ConfigKeys.Cookies);
    const token = cookies[accessCookie.name] as string;

    return token;
  }

  registerRoutes() {
    this.createUser();
    this.getUsers();
    this.getUserById();
    this.updateUser();
    this.deleteUser();
  }
}
