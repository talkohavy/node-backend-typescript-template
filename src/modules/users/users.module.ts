import { Application } from 'express';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

export function attachUsersModule(app: Application) {
  const service = new UsersService();
  const controller = new UsersController(app, service);

  controller.attachRoutes();
}
