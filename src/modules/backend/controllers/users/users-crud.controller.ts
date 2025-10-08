import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '../../../../lib/lucky-server';
import type { AuthenticationNetworkService } from '../../services/authentication/authentication.network.service';
import type { UsersNetworkService } from '../../services/users/users.network.service';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { logger } from '../../../../core';
import { ForbiddenError, UnauthorizedError } from '../../../../lib/Errors';
import { joiBodyMiddleware } from '../../../../middlewares/joi-body.middleware';
import { extractTokenFromCookies } from '../../logic/extractTokenFromCookies';
import { createUserSchema } from './dto/createUserSchema.dto';
import { updateUserSchema } from './dto/updateUserSchema.dto';

export class UsersCrudController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly usersNetworkService: UsersNetworkService,
    private readonly authenticationNetworkService: AuthenticationNetworkService,
  ) {}

  private createUser() {
    this.app.post(API_URLS.users, joiBodyMiddleware(createUserSchema), async (req: Request, res: Response) => {
      const { body } = req;

      logger.info(`POST ${API_URLS.users} - create new user`);

      const user = await this.usersNetworkService.crudService.createUser(body);

      res.status(StatusCodes.CREATED).json(user);
    });
  }

  private getUsers() {
    this.app.get(API_URLS.users, async (req: Request, res: Response) => {
      const { query } = req;

      logger.info(`GET ${API_URLS.users} - get all users`);

      const users = await this.usersNetworkService.crudService.getUsers(query);

      res.json(users);
    });
  }

  private getUserById() {
    this.app.get(API_URLS.userById, async (req: Request, res: Response) => {
      const userId = req.params.userId! as string;

      logger.info(`GET ${API_URLS.userById} - get user by id`);

      const fetchedUser = await this.usersNetworkService.crudService.getUserById(userId);

      res.json(fetchedUser);
    });
  }

  private updateUser() {
    this.app.patch(API_URLS.userById, joiBodyMiddleware(updateUserSchema), async (req: Request, res: Response) => {
      logger.info(`PATCH ${API_URLS.userById} - updating user by ID`);

      const token = extractTokenFromCookies(req.cookies);

      const decodedToken = await this.authenticationNetworkService.tokenVerificationService.verifyToken(token);

      if (!decodedToken) throw new UnauthorizedError();

      const userId = req.params.userId!;

      if (decodedToken.id !== userId) throw new ForbiddenError();

      const userData = req.body;
      const updatedUser = await this.usersNetworkService.crudService.updateUserById(userId, userData);

      res.json(updatedUser);
    });
  }

  private deleteUser() {
    this.app.delete(API_URLS.userById, async (req: Request, res: Response) => {
      const id = req.params.userId!;

      logger.info(`DELETE ${API_URLS.userById} - delete user`);

      const token = extractTokenFromCookies(req.cookies);

      const decodedToken = await this.authenticationNetworkService.tokenVerificationService.verifyToken(token);

      if (!decodedToken) throw new UnauthorizedError();

      if (decodedToken.id !== id) throw new ForbiddenError();

      const result = await this.usersNetworkService.crudService.deleteUserById(id);

      res.json(result);
    });
  }

  attachRoutes() {
    this.createUser();
    this.getUsers();
    this.getUserById();
    this.updateUser();
    this.deleteUser();
  }
}
