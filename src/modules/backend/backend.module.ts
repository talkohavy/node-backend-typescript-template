import { Application } from 'express';
import { getAuthenticationModule } from '../authentication/authentication.module';
import { getUsersModule } from '../users/users.module';
import { AuthenticationController } from './controllers/authentication/authentication.controller';
import { BackendController } from './controllers/backend.controller';
import { UsersController } from './controllers/users/users.controller';
import { BackendMiddleware } from './middleware/backend.middleware';

export function attachBackendModule(app: Application) {
  const usersModule = getUsersModule();
  const authModule = getAuthenticationModule();

  const usersService = usersModule.getUsersService();
  const authenticationService = authModule.getAuthenticationService();

  // Initialize controllers with direct network service dependencies
  const authenticationController = new AuthenticationController(
    app,
    authenticationService,
    usersService.utilitiesService,
  );
  const usersController = new UsersController(app, usersService, authenticationService);

  // Initialize middleware and main controller
  const backendMiddleware = new BackendMiddleware(app);
  const backendController = new BackendController(authenticationController, usersController);

  backendMiddleware.use();

  backendController.attachRoutes();
}
