import { Application } from 'express';
import { StatusCodes } from '../../../common/constants';
import { NotFoundError } from '../../../lib/Errors';
import { logger } from '../../../lib/logger';
import { joiBodyMiddleware } from '../../../middlewares/joiBodyMiddleware';
import { sendAuthCookies } from '../logic/sendAuthCookies';
import { UserNotFoundError } from '../logic/users.errors';
import { UsersService } from '../services/users.service';
import { createUserSchema } from './dto/createUserSchema.dto';
import { updateUserSchema } from './dto/updateUserSchema.dto';

export class UsersCrudController {
  constructor(
    private readonly app: Application,
    private readonly usersService: UsersService,
  ) {}

  private createUser() {
    this.app.post('/users', joiBodyMiddleware(createUserSchema), async (req, res) => {
      logger.info('POST /users - creating new user');

      const { body } = req;

      const createdUser = await this.usersService.usersCrudService.createUser(body);

      await sendAuthCookies({ res, user: createdUser });

      res.status(StatusCodes.CREATED).json(createdUser);
    });
  }

  private getUsers() {
    this.app.get('/users', async (_req, res) => {
      logger.info('GET /users - fetching users');

      const users = await this.usersService.usersCrudService.getUsers();

      res.json(users);
    });
  }

  private getUserById() {
    try {
      this.app.get('/users/:id', async (req, res) => {
        logger.info('GET /users/:id - fetching user by ID');

        const userId = req.params.id;

        const user = await this.usersService.usersCrudService.getUserById(userId);

        res.json(user);
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
        const updatedUser = await this.usersService.usersCrudService.updateUser(userId, user);

        res.json(updatedUser);
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
        await this.usersService.usersCrudService.deleteUser(userId);

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
    this.createUser();
    this.getUsers();
    this.getUserById();
    this.updateUser();
    this.deleteUser();
  }
}
