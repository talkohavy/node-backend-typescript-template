import type { Application, Request, Response } from 'express';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { UsersCrudService } from '../services/users-crud.service';
import { API_URLS, StatusCodes } from '../../../common/constants';
import { logger } from '../../../core';
import { joiBodyMiddleware } from '../../../middlewares/joi-body.middleware';
import { createUserSchema } from './dto/createUserSchema.dto';
import { updateUserSchema } from './dto/updateUserSchema.dto';

export class UsersCrudController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly usersService: UsersCrudService,
  ) {}

  private createUser() {
    this.app.post(API_URLS.users, joiBodyMiddleware(createUserSchema), async (req: Request, res: Response) => {
      const { body } = req;

      logger.info(`POST ${API_URLS.users} - create new user`);

      const user = await this.usersService.createUser(body);

      res.status(StatusCodes.CREATED).json(user);
    });
  }

  private getUsers() {
    this.app.get(API_URLS.users, async (req: Request, res: Response) => {
      const { query } = req;

      logger.info(`GET ${API_URLS.users} - get all users`);

      const users = await this.usersService.getUsers(query);

      res.json(users);
    });
  }

  private getUserById() {
    this.app.get(API_URLS.userById, async (req: Request, res: Response) => {
      const id = req.params.userId! as string;

      logger.info(`GET ${API_URLS.userById} - get user by id`);

      const fetchedUser = await this.usersService.getUserById(id);

      res.json(fetchedUser);
    });
  }

  private updateUserById() {
    this.app.patch(API_URLS.userById, joiBodyMiddleware(updateUserSchema), async (req: Request, res: Response) => {
      logger.info(`PATCH ${API_URLS.userById} - updating user by ID`);

      const userId = req.params.userId!;
      const userData = req.body;

      const updatedUser = await this.usersService.updateUserById(userId, userData);

      res.json(updatedUser);
    });
  }

  private deleteUserById() {
    this.app.delete(API_URLS.userById, async (req: Request, res: Response) => {
      const userId = req.params.userId!;

      logger.info(`DELETE ${API_URLS.userById} - delete user`);

      const result = await this.usersService.deleteUserById(userId);

      res.json(result);
    });
  }

  registerRoutes() {
    this.createUser();
    this.getUsers();
    this.getUserById();
    this.updateUserById();
    this.deleteUserById();
  }
}
