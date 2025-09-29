import { Application } from 'express';
import { AuthenticationController } from './controllers';
import { PasswordManagementController } from './controllers/password-management.controller';
import { SessionManagementController } from './controllers/session-management.controller';
import { TokenGenerationController } from './controllers/token-generation.controller';
import { TokenVerificationController } from './controllers/token-verification.controller';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { AuthenticationService } from './services/authentication.service';
import { PasswordManagementService } from './services/password-management.service';
import { TokenGenerationService } from './services/token-generation.service';
import { TokenVerificationService } from './services/token-verification.service';

export class AuthenticationModule {
  private static instance: AuthenticationModule;
  private authenticationService!: AuthenticationService;

  private constructor() {
    this.initializeModule();
  }

  static getInstance(): AuthenticationModule {
    if (!AuthenticationModule.instance) {
      AuthenticationModule.instance = new AuthenticationModule();
    }
    return AuthenticationModule.instance;
  }

  protected initializeModule(): void {
    // Initialize services
    const passwordManagementService = new PasswordManagementService();
    const tokenGenerationService = new TokenGenerationService();
    const tokenVerificationService = new TokenVerificationService();

    this.authenticationService = new AuthenticationService(
      passwordManagementService,
      tokenGenerationService,
      tokenVerificationService,
    );
  }

  attachController(app: Application): void {
    const authenticationMiddleware = new AuthenticationMiddleware(app);
    const passwordManagementController = new PasswordManagementController(
      app,
      this.authenticationService.passwordManagementService,
    );
    const tokenGenerationController = new TokenGenerationController(
      app,
      this.authenticationService.tokenGenerationService,
    );
    const tokenVerificationController = new TokenVerificationController(
      app,
      this.authenticationService.tokenVerificationService,
    );
    const sessionManagementController = new SessionManagementController(app);

    const authenticationController = new AuthenticationController(
      passwordManagementController,
      tokenGenerationController,
      tokenVerificationController,
      sessionManagementController,
    );

    authenticationMiddleware.use();

    authenticationController.attachRoutes();
  }

  getAuthenticationService(): AuthenticationService {
    return this.authenticationService;
  }
}
