import type { ServerApp } from '../../common/types';
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
  private userUtilitiesNetworkService!: UserUtilitiesNetworkService;
  private passwordManagementNetworkService!: PasswordManagementNetworkService;
  private tokenGenerationNetworkService!: TokenGenerationNetworkService;
  private tokenVerificationNetworkService!: TokenVerificationNetworkService;
  private authenticationNetworkService!: AuthenticationNetworkService;
  private usersCrudNetworkService!: UsersCrudNetworkService;
  private usersNetworkService!: UsersNetworkService;

  constructor(private readonly app: ServerApp) {
    this.initializeModule();
  }

  private initializeModule(): void {
    const { userUtilitiesService, usersCrudService } = this.app.modules.UsersModule;
    const { passwordManagementService, tokenGenerationService, tokenVerificationService } =
      this.app.modules.AuthenticationModule.getAuthenticationService();

    // Init AuthenticationNetworkService
    this.passwordManagementNetworkService = new PasswordManagementNetworkService(passwordManagementService);
    this.tokenGenerationNetworkService = new TokenGenerationNetworkService(tokenGenerationService);
    this.tokenVerificationNetworkService = new TokenVerificationNetworkService(tokenVerificationService);
    this.authenticationNetworkService = new AuthenticationNetworkService(
      this.passwordManagementNetworkService,
      this.tokenGenerationNetworkService,
      this.tokenVerificationNetworkService,
    );

    // Init UsersNetworkService
    this.usersCrudNetworkService = new UsersCrudNetworkService(usersCrudService);
    this.userUtilitiesNetworkService = new UserUtilitiesNetworkService(userUtilitiesService);
    this.usersNetworkService = new UsersNetworkService(this.usersCrudNetworkService, this.userUtilitiesNetworkService);

    this.attachController(this.app);
  }

  private attachController(app: ServerApp): void {
    // Init Authentication Controller
    const authenticationController = new AuthenticationController(
      app,
      this.authenticationNetworkService,
      this.userUtilitiesNetworkService,
    );

    // Init UsersCrud Controller
    const usersCrudController = new UsersCrudController(
      app,
      this.usersNetworkService,
      this.authenticationNetworkService,
    );

    // Init UserUtilities Controller
    const userUtilitiesController = new UserUtilitiesController(
      app,
      this.usersNetworkService,
      this.authenticationNetworkService,
    );
    // Init Users Controller
    const usersController = new UsersController(userUtilitiesController, usersCrudController);

    // Initialize middleware and main controller
    const backendMiddleware = new BackendMiddleware(app);
    const backendController = new BackendController(authenticationController, usersController);

    backendMiddleware.use();

    backendController.attachRoutes();
  }
}
