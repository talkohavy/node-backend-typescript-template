import { Application } from 'express';
import { UsersController } from './users.controller';
import { UsersMiddleware } from './users.middleware';
import { UsersService } from './users.service';

export function attachUsersModule(app: Application) {
  const service = new UsersService();
  const controller = new UsersController(app, service);
  const middleware = new UsersMiddleware();

  middleware.use(app);

  controller.attachRoutes();
}
