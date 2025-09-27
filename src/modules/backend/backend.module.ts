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

export class BackendModule {
  private static instance: BackendModule;
  private userUtilitiesNetworkService!: UserUtilitiesNetworkService;
  private passwordManagementNetworkService!: PasswordManagementNetworkService;
  private tokenGenerationNetworkService!: TokenGenerationNetworkService;
  private tokenVerificationNetworkService!: TokenVerificationNetworkService;
  private authenticationNetworkService!: AuthenticationNetworkService;
  private usersCrudNetworkService!: UsersCrudNetworkService;
  private usersNetworkService!: UsersNetworkService;

  private constructor() {
    this.initializeModule();
  }

  static getInstance(): BackendModule {
    if (!BackendModule.instance) {
      BackendModule.instance = new BackendModule();
    }
    return BackendModule.instance;
  }

  protected initializeModule(): void {
    this.userUtilitiesNetworkService = new UserUtilitiesNetworkService();
    this.passwordManagementNetworkService = new PasswordManagementNetworkService();
    this.tokenGenerationNetworkService = new TokenGenerationNetworkService();
    this.tokenVerificationNetworkService = new TokenVerificationNetworkService();
    this.authenticationNetworkService = new AuthenticationNetworkService(
      this.passwordManagementNetworkService,
      this.tokenGenerationNetworkService,
      this.tokenVerificationNetworkService,
    );

    this.usersCrudNetworkService = new UsersCrudNetworkService();
    this.usersNetworkService = new UsersNetworkService(this.usersCrudNetworkService, this.userUtilitiesNetworkService);
  }

  attachController(app: Application): void {
    const authenticationController = new AuthenticationController(
      app,
      this.authenticationNetworkService,
      this.userUtilitiesNetworkService,
    );

    const usersCrudController = new UsersCrudController(
      app,
      this.usersNetworkService,
      this.authenticationNetworkService,
    );
    const userUtilitiesController = new UserUtilitiesController(
      app,
      this.usersNetworkService,
      this.authenticationNetworkService,
    );
    const usersController = new UsersController(userUtilitiesController, usersCrudController);

    // Initialize middleware and main controller
    const backendMiddleware = new BackendMiddleware(app);
    const backendController = new BackendController(authenticationController, usersController);

    backendMiddleware.use();

    backendController.attachRoutes();
  }
}
