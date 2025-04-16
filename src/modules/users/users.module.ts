import { Application } from 'express';
import { UsersController } from './users.controller.js';
import { UsersMiddleware } from './users.middleware.js';
import { UsersService } from './users.service.js';

export function attachUsersModule(app: Application) {
  const service = new UsersService();
  const controller = new UsersController(app, service);
  const middleware = new UsersMiddleware();

  middleware.use(app);

  controller.attachRoutes();
}
