import type { ServerApp } from '../../common/types';
import type { IAuthAdapter } from './adapters/interfaces/auth.adapter.interface';
import type { IUsersAdapter } from './adapters/interfaces/users.adapter.interface';
import { IS_MICRO_SERVICES } from '../../common/constants';
import { HealthCheckController } from '../health-check/health-check.controller';
import { AuthDirectAdapter } from './adapters/auth.direct.adapter';
import { AuthHttpAdapter } from './adapters/auth.http.adapter';
import { HttpClient } from './adapters/http-client';
import { UsersDirectAdapter } from './adapters/users.direct.adapter';
import { UsersHttpAdapter } from './adapters/users.http.adapter';
import { AuthenticationController } from './controllers/authentication/authentication.controller';
import { UserUtilitiesController } from './controllers/users/user-utilities.controller';
import { UsersCrudController } from './controllers/users/users-crud.controller';

/**
 * BackendModule serves as the BFF (Backend-For-Frontend).
 * It owns ALL public-facing routes and orchestrates communication with domain modules.
 *
 * In monolith mode: Uses direct adapters that call module services directly.
 * In micro-services mode: Uses HTTP adapters that make HTTP calls to other services.
 */
export class BackendModule {
  private usersAdapter!: IUsersAdapter;
  private authAdapter!: IAuthAdapter;

  constructor(private readonly app: ServerApp) {
    this.initializeAdapters();
    this.attachRoutes();
  }

  private initializeAdapters(): void {
    if (IS_MICRO_SERVICES) {
      // HTTP adapters for micro-services communication
      const httpClient = new HttpClient(this.app.configService);
      this.usersAdapter = new UsersHttpAdapter(httpClient);
      this.authAdapter = new AuthHttpAdapter(httpClient);
    } else {
      // Direct adapters wrapping module services (monolith mode)
      const { usersCrudService, userUtilitiesService } = this.app.modules.UsersModule.services;
      const { passwordManagementService, tokenGenerationService, tokenVerificationService } =
        this.app.modules.AuthenticationModule.services;

      this.usersAdapter = new UsersDirectAdapter(usersCrudService, userUtilitiesService);
      this.authAdapter = new AuthDirectAdapter(
        passwordManagementService,
        tokenGenerationService,
        tokenVerificationService,
      );
    }
  }

  private attachRoutes(): void {
    // BackendModule ALWAYS attaches public routes (it's the BFF)
    const healthCheckController = new HealthCheckController(this.app);
    const authController = new AuthenticationController(this.app, this.authAdapter, this.usersAdapter);
    const usersCrudController = new UsersCrudController(this.app, this.usersAdapter, this.authAdapter);
    const userUtilitiesController = new UserUtilitiesController(this.app, this.usersAdapter, this.authAdapter);

    healthCheckController.registerRoutes();
    authController.registerRoutes();
    usersCrudController.registerRoutes();
    userUtilitiesController.registerRoutes();
  }
}
