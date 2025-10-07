import { Application, Request, Response } from 'express';
import { StatusCodes } from '../../../common/constants';
import { logger } from '../../../core';
import { ControllerFactory } from '../../../lib/lucky-server';
import { joiBodyMiddleware } from '../../../middlewares/joi-body.middleware';
import { UsersCrudService } from '../services/users-crud.service';
import { createUserSchema } from './dto/createUserSchema.dto';
import { updateUserSchema } from './dto/updateUserSchema.dto';

export class UsersCrudController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly usersService: UsersCrudService,
  ) {}

  private createUser() {
    this.app.post('/users', joiBodyMiddleware(createUserSchema), async (req: Request, res: Response) => {
      const { body } = req;

      logger.info('POST /users - create new user');

      const user = await this.usersService.createUser(body);

      res.status(StatusCodes.CREATED).json(user);
    });
  }

  private getUsers() {
    this.app.get('/users', async (req: Request, res: Response) => {
      const { query } = req;

      logger.info('GET /users - get all users');

      const users = await this.usersService.getUsers(query);

      res.json(users);
    });
  }

  private getUserById() {
    this.app.get('/users/:id', async (req: Request, res: Response) => {
      const id = req.params.id! as string;

      logger.info(`GET /users/${id} - get user by id`);

      const fetchedUser = await this.usersService.getUserById(id);

      res.json(fetchedUser);
    });
  }

  private updateUserById() {
    this.app.patch('/users/:id', joiBodyMiddleware(updateUserSchema), async (req: Request, res: Response) => {
      logger.info('PUT /users/:id - updating user by ID');

      const userId = req.params.id!;
      const userData = req.body;

      const updatedUser = await this.usersService.updateUserById(userId, userData);

      res.json(updatedUser);
    });
  }

  private deleteUserById() {
    this.app.delete('/users/:id', async (req: Request, res: Response) => {
      const id = req.params.id!;

      logger.info(`DELETE /users/${id} - delete user`);

      const result = await this.usersService.deleteUserById(id);

      res.json(result);
    });
  }

  attachRoutes() {
    this.createUser();
    this.getUsers();
    this.getUserById();
    this.updateUserById();
    this.deleteUserById();
  }
}
