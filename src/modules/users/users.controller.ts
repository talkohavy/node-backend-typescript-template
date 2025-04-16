import { Application } from 'express';
import { STATUS_CODES } from '../../common/constants.js';
import { attachJoiMiddleware } from '../../middlewares/attachJoiMiddleware.js';
import { createUserSchema } from './users.dto.js';
import { UsersService } from './users.service.js';

export class UsersController {
  app: Application;
  usersService: UsersService;

  constructor(app: Application, usersService: UsersService) {
    this.app = app;
    this.usersService = usersService;
  }

  getUsers() {
    this.app.get('/users', async (_req, res) => {
      const users = await this.usersService.getUsers();

      res.json(users);
    });
  }

  getUserById() {
    this.app.get('/users/:id', async (req, res): Promise<any> => {
      const userId = req.params.id;

      const user = await this.usersService.getUserById(userId);

      if (!user) return res.json({ message: 'User not found' });

      res.json(user);
    });
  }

  createUser() {
    this.app.post('/users', attachJoiMiddleware(createUserSchema), async (req, res) => {
      const { body } = req;

      const newUser = await this.usersService.createUser(body);

      res.status(STATUS_CODES.CREATED).json(newUser);
    });
  }

  updateUser() {
    this.app.put('/users/:id', async (req, res): Promise<any> => {
      const userId = req.params.id;
      const user = req.body;
      const updatedUser = await this.usersService.updateUser(userId, user);

      if (!updatedUser) return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found' });

      res.json(updatedUser);
    });
  }

  deleteUser() {
    this.app.delete('/users/:id', async (req, res): Promise<any> => {
      const userId = req.params.id;
      const deletedUser = await this.usersService.deleteUser(userId);

      if (!deletedUser) return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found' });

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
