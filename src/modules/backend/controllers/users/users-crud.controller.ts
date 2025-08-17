import { Application, Request, Response } from 'express';
import { StatusCodes } from '../../../../common/constants';
import { ControllerFactory } from '../../../../lib/controller-factory';
import { ForbiddenError, UnauthorizedError } from '../../../../lib/Errors';
import { logger } from '../../../../lib/logger';
import { joiBodyMiddleware } from '../../../../middlewares/joiBodyMiddleware';
import { extractTokenFromCookies } from '../../logic/extractTokenFromCookies';
import { AuthenticationNetworkService } from '../../services/authentication/authentication.network.service';
import { UsersNetworkService } from '../../services/users/users.network.service';
import { createUserSchema } from './dto/createUserSchema.dto';
import { updateUserSchema } from './dto/updateUserSchema.dto';

export class UsersCrudController implements ControllerFactory {
  constructor(
    private readonly app: Application,
    private readonly usersNetworkService: UsersNetworkService,
    private readonly authenticationNetworkService: AuthenticationNetworkService,
  ) {}

  private createUser() {
    this.app.post('/users-service/users', joiBodyMiddleware(createUserSchema), async (req: Request, res: Response) => {
      const { body } = req;

      logger.info('POST /users-service/users - create new user');

      const user = await this.usersNetworkService.crudService.createUser(body);

      res.status(StatusCodes.CREATED).json(user);
    });
  }

  private getUsers() {
    this.app.get('/users-service/users', async (req: Request, res: Response) => {
      const { query } = req;

      logger.info('GET /users-service/users - get all users');

      const users = await this.usersNetworkService.crudService.getUsers(query);

      res.json(users);
    });
  }

  private getUserById() {
    this.app.get('/users-service/users/:id', async (req: Request, res: Response) => {
      const id = req.params.id! as string;

      logger.info(`GET /users-service/users/${id} - get user by id`);

      const fetchedUser = await this.usersNetworkService.crudService.getUserById(id);

      res.json(fetchedUser);
    });
  }

  private updateUser() {
    this.app.patch(
      '/users-service/users/:id',
      joiBodyMiddleware(updateUserSchema),
      async (req: Request, res: Response) => {
        logger.info('PUT /users-service/users/:id - updating user by ID');

        const token = extractTokenFromCookies(req.cookies);

        const decodedToken = await this.authenticationNetworkService.tokenVerificationService.verifyToken(token);

        if (!decodedToken) throw new UnauthorizedError();

        const userId = req.params.id!;

        if (decodedToken.id !== userId) throw new ForbiddenError();

        const userData = req.body;
        const updatedUser = await this.usersNetworkService.crudService.updateUserById(userId, userData);

        res.json(updatedUser);
      },
    );
  }

  private deleteUser() {
    this.app.delete('/users-service/users/:id', async (req: Request, res: Response) => {
      const id = req.params.id!;

      logger.info(`DELETE /users-service/users/${id} - delete user`);

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
