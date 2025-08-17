import { Application } from 'express';
import { AuthenticationController } from './controllers/authentication/authentication.controller';
import { BackendController } from './controllers/backend.controller';
import { UserUtilitiesController } from './controllers/users/user-utilities.controller';
import { UsersCrudController } from './controllers/users/users-crud.controller';
import { UsersController } from './controllers/users/users.controller';
import { BackendMiddleware } from './middleware/backend.middleware';
import { AuthenticationNetworkService } from './services/authentication/authentication.network.service';
import { PasswordManagementNetworkService } from './services/authentication/password-management.network.service';
import { TokenGenerationNetworkService } from './services/authentication/token-generation.network.service';
import { TokenVerificationNetworkService } from './services/authentication/token-verification.network.service';
import { UserUtilitiesNetworkService } from './services/users/user-utilities.network.service';
import { UsersCrudNetworkService } from './services/users/users-crud.network.service';
import { UsersNetworkService } from './services/users/users.network.service';

export function attachBackendModule(app: Application) {
  // initialize shared services
  const userUtilitiesNetworkService = new UserUtilitiesNetworkService();

  // Initialize authentication controller
  const passwordManagementNetworkService = new PasswordManagementNetworkService();
  const tokenGenerationNetworkService = new TokenGenerationNetworkService();
  const tokenVerificationNetworkService = new TokenVerificationNetworkService();
  const authenticationNetworkService = new AuthenticationNetworkService(
    passwordManagementNetworkService,
    tokenGenerationNetworkService,
    tokenVerificationNetworkService,
  );

  const authenticationController = new AuthenticationController(
    app,
    authenticationNetworkService,
    userUtilitiesNetworkService,
  );

  // Initialize users controller
  const usersCrudNetworkService = new UsersCrudNetworkService();
  const usersNetworkService = new UsersNetworkService(usersCrudNetworkService, userUtilitiesNetworkService);

  const usersCrudController = new UsersCrudController(app, usersNetworkService, authenticationNetworkService);
  const userUtilitiesController = new UserUtilitiesController(app, usersNetworkService, authenticationNetworkService);
  const usersController = new UsersController(userUtilitiesController, usersCrudController);

  // Initialize middleware and main controller
  const backendMiddleware = new BackendMiddleware(app);
  const backendController = new BackendController(authenticationController, usersController);

  backendMiddleware.use();

  backendController.attachRoutes();
}
