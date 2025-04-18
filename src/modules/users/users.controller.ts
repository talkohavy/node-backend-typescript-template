import { Application } from 'express';
import { STATUS_CODES } from '../../common/constants';
import { logger } from '../../lib/logger';
import { attachJoiMiddleware } from '../../middlewares/attachJoiMiddleware';
import { createUserSchema } from './users.dto';
import { UsersService } from './users.service';

export class UsersController {
  app: Application;
  usersService: UsersService;

  constructor(app: Application, usersService: UsersService) {
    this.app = app;
    this.usersService = usersService;
  }

  getUsers() {
    this.app.get('/users', async (_req, res) => {
      logger.info('GET /users - fetching users');

      const users = await this.usersService.getUsers();

      res.json(users);
    });
  }

  getUserById() {
    this.app.get('/users/:id', async (req, res): Promise<any> => {
      logger.info('GET /users/:id - fetching user by ID');

      const userId = req.params.id;

      const user = await this.usersService.getUserById(userId);

      if (!user) {
        logger.error('User not found', userId);

        return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found' });
      }

      res.json(user);
    });
  }

  createUser() {
    this.app.post('/users', attachJoiMiddleware(createUserSchema), async (req, res) => {
      logger.info('POST /users - creating new user');

      const { body } = req;

      const newUser = await this.usersService.createUser(body);

      res.status(STATUS_CODES.CREATED).json(newUser);
    });
  }

  updateUser() {
    this.app.put('/users/:id', async (req, res): Promise<any> => {
      logger.info('PUT /users/:id - updating user by ID');

      const userId = req.params.id;
      const user = req.body;
      const updatedUser = await this.usersService.updateUser(userId, user);

      if (!updatedUser) {
        logger.error('User not found', userId);

        return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found' });
      }

      res.json(updatedUser);
    });
  }

  deleteUser() {
    this.app.delete('/users/:id', async (req, res): Promise<any> => {
      logger.info('DELETE /users/:id - deleting user by ID');

      const userId = req.params.id;
      const deletedUser = await this.usersService.deleteUser(userId);

      if (!deletedUser) {
        logger.error('User not found', userId);

        return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    });
  }

  attachRoutes() {
    this.getUsers();
    this.getUserById();
    this.createUser();
    this.updateUser();
    this.deleteUser();
  }
}
