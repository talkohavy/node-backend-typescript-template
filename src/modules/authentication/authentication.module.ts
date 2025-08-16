import { Application } from 'express';
import { AuthenticationController } from './controllers';
import { PasswordManagementController } from './controllers/password-management.controller';
import { SessionManagementController } from './controllers/session-management.controller';
import { TokenGenerationController } from './controllers/token-generation.controller';
import { TokenVerificationController } from './controllers/token-verification.controller';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { PasswordManagementService } from './services/password-management.service';
import { TokenGenerationService } from './services/token-generation.service';
import { TokenVerificationService } from './services/token-verification.service';

export class AuthenticationModule {
  private static instance: AuthenticationModule;
  private passwordManagementService!: PasswordManagementService;
  private tokenGenerationService!: TokenGenerationService;
  private tokenVerificationService!: TokenVerificationService;

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
    this.passwordManagementService = new PasswordManagementService();
    this.tokenGenerationService = new TokenGenerationService();
    this.tokenVerificationService = new TokenVerificationService();
  }

  attachController(app: Application): void {
    const authenticationMiddleware = new AuthenticationMiddleware(app);
    const passwordManagementController = new PasswordManagementController(app, this.passwordManagementService);
    const tokenGenerationController = new TokenGenerationController(app, this.tokenGenerationService);
    const tokenVerificationController = new TokenVerificationController(app, this.tokenVerificationService);
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

  getPasswordManagementService(): PasswordManagementService {
    return this.passwordManagementService;
  }

  getTokenGenerationService(): TokenGenerationService {
    return this.tokenGenerationService;
  }

  getTokenVerificationService(): TokenVerificationService {
    return this.tokenVerificationService;
  }
}

export function getAuthenticationModule(): AuthenticationModule {
  return AuthenticationModule.getInstance();
}
