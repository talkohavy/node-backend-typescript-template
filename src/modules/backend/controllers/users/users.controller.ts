import { Application, Request, Response } from 'express';
import { StatusCodes } from '../../../../common/constants';
import { ControllerFactory } from '../../../../lib/controller-factory';
import { logger } from '../../../../lib/logger';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { UsersService } from '../../../users/services/users.service';
import { BaseController } from '../shared/base.controller';

export class UsersController extends BaseController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly authService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  /**
   * Used on browser load, to fetch the user profile using a token, without specifying a userId.
   */
  private getProfile() {
    this.app.get('/users-service/users/get-profile', async (req: Request, res: Response) => {
      logger.info(`GET /users-service/users/get-profile - get user profile`);

      const { decodedToken } = await this.getUserIfExists({
        headers: req.headers,
        authService: this.authService,
        shouldThrow: false,
      });

      if (!decodedToken) return void res.status(StatusCodes.NO_CONTENT).json({}); // <--- silently fail

      const userId = decodedToken?.id;

      const fetchedUser = await this.usersService.getUserById(userId);

      res.json(fetchedUser);
    });
  }

  private createUser() {
    this.app.post('/users-service/users', async (req: Request, res: Response) => {
      const { body } = req;

      logger.info('POST /users-service/users - create new user');

      const user = await this.usersService.createUser(body);

      res.status(StatusCodes.CREATED).json(user);
    });
  }

  private getUsers() {
    this.app.get('/users-service/users', async (req: Request, res: Response) => {
      const { query } = req;

      logger.info('GET /users-service/users - get all users');

      const users = await this.usersService.getUsers(query);

      res.json(users);
    });
  }

  private getUserById() {
    this.app.get('/users-service/users/:id', async (req: Request, res: Response) => {
      const id = req.params.id! as string;

      logger.info(`GET /users-service/users/${id} - get user by id`);

      // const { userHeaders } = await this.getUserIfExists({
      //   headers: req.headers,
      //   authService: this.authService,
      //   shouldThrow: false,
      // });

      const fetchedUser = await this.usersService.getUserById(id);

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

      const result = await this.usersService.deleteUser(id);

      res.json(result);
    });
  }

  attachRoutes() {
    this.getProfile();
    this.createUser();
    this.getUsers();
    this.getUserById();
    this.deleteUser();
  }
}
