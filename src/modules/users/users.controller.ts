import { Application } from 'express';
import { STATUS_CODES } from '../../common/constants';
import { logger } from '../../lib/logger';
import { attachJoiMiddleware } from '../../middlewares/attachJoiMiddleware';
import { sanitizeUser, sanitizeUsers } from './logic/sanitizeUser';
import { sendAuthCookies } from './logic/sendAuthCookies';
import { createUserSchema, loginUserSchema, updateUserSchema } from './users.dto';
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

      const sanitizedUsers = sanitizeUsers(users);

      res.status(STATUS_CODES.OK).json(sanitizedUsers);
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

      const sanitizedUser = sanitizeUser(user);

      res.status(STATUS_CODES.OK).json(sanitizedUser);
    });
  }

  createUser() {
    this.app.post('/users', attachJoiMiddleware(createUserSchema), async (req, res) => {
      logger.info('POST /users - creating new user');

      const { body } = req;

      const createdUser = await this.usersService.createUser(body);

      await sendAuthCookies({ res, user: createdUser });

      const sanitizedCreatedUser = sanitizeUser(createdUser);

      res.status(STATUS_CODES.CREATED).json(sanitizedCreatedUser);
    });
  }

  updateUser() {
    this.app.patch('/users/:id', attachJoiMiddleware(updateUserSchema), async (req, res): Promise<any> => {
      logger.info('PUT /users/:id - updating user by ID');

      const userId = req.params.id;
      const user = req.body;
      const updatedUser = await this.usersService.updateUser(userId, user);

      if (!updatedUser) {
        logger.error('User not found', userId);

        return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found' });
      }

      const sanitizedUpdatedUser = sanitizeUser(updatedUser);

      res.status(STATUS_CODES.OK).json(sanitizedUpdatedUser);
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

      res.status(STATUS_CODES.OK).json({ message: 'User deleted successfully' });
    });
  }

  login() {
    this.app.post('/users/login', attachJoiMiddleware(loginUserSchema), async (req, res): Promise<any> => {
      logger.info('POST /users/login - user login');

      const { email, password } = req.body;

      const user = await this.usersService.login(email, password);

      if (!user) {
        logger.error('Login failed for email', email);
        return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Invalid credentials' });
      }

      await sendAuthCookies({ res, user });

      const sanitizedUser = sanitizeUser(user);

      res.status(STATUS_CODES.OK).json(sanitizedUser);
    });
  }

  attachRoutes() {
    this.getUsers();
    this.getUserById();
    this.createUser();
    this.updateUser();
    this.deleteUser();
    this.login();
  }
}
