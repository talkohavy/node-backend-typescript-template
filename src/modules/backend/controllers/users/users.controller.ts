import { Application, Request, Response } from 'express';
import { StatusCodes } from '../../../../common/constants';
import { ControllerFactory } from '../../../../lib/controller-factory';
import { logger } from '../../../../lib/logger';
import { UsersService } from '../../../users/services/users.service';

export class UsersController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly usersService: UsersService,
  ) {}

  private createUser() {
    this.app.post('/users-service/users', async (req: Request, res: Response) => {
      const { body } = req;

      logger.info('POST /users-service/users - create new user');

      const user = await this.usersService.usersCrudService.createUser(body);

      res.status(StatusCodes.CREATED).json(user);
    });
  }

  private getUsers() {
    this.app.get('/users-service/users', async (req: Request, res: Response) => {
      const { query } = req;

      logger.info('GET /users-service/users - get all users');

      const users = await this.usersService.usersCrudService.getUsers(query);

      res.json(users);
    });
  }

  private getUserById() {
    this.app.get('/users-service/users/:id', async (req: Request, res: Response) => {
      const id = req.params.id! as string;

      logger.info(`GET /users-service/users/${id} - get user by id`);

      const fetchedUser = await this.usersService.usersCrudService.getUserById(id);

      res.json(fetchedUser);
    });
  }

  private deleteUser() {
    this.app.delete('/users-service/users/:id', async (req: Request, res: Response) => {
      const id = req.params.id!;

      logger.info(`DELETE /users-service/users/${id} - delete user`);

      // const { userHeaders } = await this.getUserIfExists({
      //   headers: req.headers,
      //   authService: this.authService,
      // });

      const result = await this.usersService.usersCrudService.deleteUser(id);

      res.json(result);
    });
  }

  attachRoutes() {
    this.createUser();
    this.getUsers();
    this.getUserById();
    this.deleteUser();
  }
}
