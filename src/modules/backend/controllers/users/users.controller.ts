import { Application, Request, Response } from 'express';
import { StatusCodes } from '../../../../common/constants';
import { ControllerFactory } from '../../../../lib/controller-factory';
import { ForbiddenError, UnauthorizedError } from '../../../../lib/Errors';
import { logger } from '../../../../lib/logger';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { UsersService } from '../../../users/services/users.service';
import { extractTokenFromCookies } from '../../logic/extractTokenFromCookies';

export class UsersController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  private getProfile() {
    this.app.get('/users-service/users/get-profile', async (req: Request, res: Response) => {
      logger.info(`GET /users-service/users/get-profile - get user profile`);

      const token = extractTokenFromCookies(req.cookies);

      const decodedToken = await this.authenticationService.tokenVerificationService.verifyToken(token);

      if (!decodedToken) return void res.status(StatusCodes.NO_CONTENT).json({}); // <--- silently fail

      const userId = decodedToken?.id;

      const fetchedUser = await this.usersService.crudService.getUserById(userId);

      res.json(fetchedUser);
    });
  }

  private createUser() {
    this.app.post('/users-service/users', async (req: Request, res: Response) => {
      const { body } = req;

      logger.info('POST /users-service/users - create new user');

      const user = await this.usersService.crudService.createUser(body);

      res.status(StatusCodes.CREATED).json(user);
    });
  }

  private getUsers() {
    this.app.get('/users-service/users', async (req: Request, res: Response) => {
      const { query } = req;

      logger.info('GET /users-service/users - get all users');

      const users = await this.usersService.crudService.getUsers(query);

      res.json(users);
    });
  }

  private getUserById() {
    this.app.get('/users-service/users/:id', async (req: Request, res: Response) => {
      const id = req.params.id! as string;

      logger.info(`GET /users-service/users/${id} - get user by id`);

      const fetchedUser = await this.usersService.crudService.getUserById(id);

      res.json(fetchedUser);
    });
  }

  private deleteUser() {
    this.app.delete('/users-service/users/:id', async (req: Request, res: Response) => {
      const id = req.params.id!;

      logger.info(`DELETE /users-service/users/${id} - delete user`);

      const token = extractTokenFromCookies(req.cookies);

      const decodedToken = await this.authenticationService.tokenVerificationService.verifyToken(token);

      if (!decodedToken) throw new UnauthorizedError();

      if (decodedToken.id !== id) throw new ForbiddenError();

      const result = await this.usersService.crudService.deleteUser(id);

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
