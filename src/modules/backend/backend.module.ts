import { Application } from 'express';
import { getAuthenticationModule } from '../authentication/authentication.module';
import { getUsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth/auth.controller';
import { BackendController } from './controllers/backend.controller';
import { UsersController } from './controllers/users/users.controller';
import { BackendMiddleware } from './middleware/backend.middleware';

export function attachBackendModule(app: Application) {
  const usersModule = getUsersModule();
  const authModule = getAuthenticationModule();

  const usersService = usersModule.getUsersService();
  const authService = authModule.getAuthenticationService();

  // Initialize controllers with direct network service dependencies
  const authController = new AuthController(app, authService, usersService.userUtilitiesService);
  const usersController = new UsersController(app, authService, usersService);

  // Initialize middleware and main controller
  const backendMiddleware = new BackendMiddleware(app);
  const backendController = new BackendController(authController, usersController);

  backendMiddleware.use();

  backendController.attachRoutes();
}
