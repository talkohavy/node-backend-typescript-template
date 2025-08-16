import { Application, Request } from 'express';
import { STATUS_CODES } from '../../../common/constants';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../lib/Errors';
import { logger } from '../../../lib/logger';
import { joiBodyMiddleware } from '../../../middlewares/joiBodyMiddleware';
import { sanitizeUser, sanitizeUsers } from '../logic/sanitizeUser';
import { sendAuthCookies } from '../logic/sendAuthCookies';
import { UserAlreadyExistsError, UserNotFoundError } from '../logic/users.errors';
import { UsersMiddleware } from '../middleware/users.middleware';
import { UsersService } from '../services/users.service';
import { createUserSchema } from './dto/createUserSchema.dto';
import { loginUserSchema } from './dto/loginUserSchema.dto';
import { updateUserSchema } from './dto/updateUserSchema.dto';

export class UsersController {
  constructor(
    private readonly app: Application,
    private readonly usersService: UsersService,
  ) {}

  private login() {
    this.app.post('/users/login', joiBodyMiddleware(loginUserSchema), async (req, res) => {
      try {
        logger.info('POST /users/login - user login');

        const { email, password } = req.body;

        const user = await this.usersService.login(email, password);

        await sendAuthCookies({ res, user });

        const sanitizedUser = sanitizeUser(user);

        res.json(sanitizedUser);
      } catch (error) {
        logger.error('Login failed for email', { error });

        throw new UnauthorizedError('Invalid credentials');
      }
    });
  }

  private protectedRoute() {
    this.app.post('/users/protected', new UsersMiddleware().authenticate, async (req: Request, res) => {
      logger.info('POST /users/protected - accessing protected route');

      logger.info('User data attached', { user: req.user });

      res.json(req.body);
    });
  }

  private createUser() {
    this.app.post('/users', joiBodyMiddleware(createUserSchema), async (req, res) => {
      try {
        logger.info('POST /users - creating new user');

        const { body } = req;

        const createdUser = await this.usersService.createUser(body);

        await sendAuthCookies({ res, user: createdUser });

        const sanitizedCreatedUser = sanitizeUser(createdUser);

        res.status(STATUS_CODES.CREATED).json(sanitizedCreatedUser);
      } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
          throw new BadRequestError(error.message, { statusCode: STATUS_CODES.CONFLICT });
        }

        throw error;
      }
    });
  }

  private getUsers() {
    this.app.get('/users', async (_req, res) => {
      logger.info('GET /users - fetching users');

      const users = await this.usersService.getUsers();

      const sanitizedUsers = sanitizeUsers(users);

      res.json(sanitizedUsers);
    });
  }

  private getUserById() {
    try {
      this.app.get('/users/:id', async (req, res) => {
        logger.info('GET /users/:id - fetching user by ID');

        const userId = req.params.id;

        const user = await this.usersService.getUserById(userId);

        const sanitizedUser = sanitizeUser(user);

        res.json(sanitizedUser);
      });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundError(error.message);
      }

      throw error;
    }
  }

  private updateUser() {
    try {
      this.app.patch('/users/:id', joiBodyMiddleware(updateUserSchema), async (req, res) => {
        logger.info('PUT /users/:id - updating user by ID');

        const userId = req.params.id;
        const user = req.body;
        const updatedUser = await this.usersService.updateUser(userId, user);

        const sanitizedUpdatedUser = sanitizeUser(updatedUser);

        res.json(sanitizedUpdatedUser);
      });
    } catch (error: any) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundError(error.message);
      }

      throw error;
    }
  }

  private deleteUser() {
    this.app.delete('/users/:id', async (req, res) => {
      try {
        logger.info('DELETE /users/:id - deleting user by ID');

        const userId = req.params.id;
        await this.usersService.deleteUser(userId);

        res.json({ message: 'User deleted successfully' });
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          throw new NotFoundError(error.message);
        }

        throw error;
      }
    });
  }

  attachRoutes() {
    this.login();
    this.protectedRoute();
    this.createUser();
    this.getUsers();
    this.getUserById();
    this.updateUser();
    this.deleteUser();
  }
}
