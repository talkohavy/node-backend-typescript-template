import type { Application } from 'express';
import { IS_MICRO_SERVICES } from '../../common/constants';
import { ConfigKeys, type JwtConfig } from '../../configurations';
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
  private passwordManagementService!: PasswordManagementService;
  private tokenGenerationService!: TokenGenerationService;
  private tokenVerificationService!: TokenVerificationService;

  constructor(private readonly app: Application) {
    this.initializeModule();
  }

  private initializeModule(): void {
    const jwtConfig = this.app.configService.get<JwtConfig>(ConfigKeys.Jwt);

    if (!jwtConfig) {
      throw new Error('JWT configuration not found');
    }

    // Initialize services
    this.passwordManagementService = new PasswordManagementService();
    this.tokenGenerationService = new TokenGenerationService(jwtConfig);
    this.tokenVerificationService = new TokenVerificationService();

    // Only attach routes if running as a standalone micro-service
    if (IS_MICRO_SERVICES) {
      this.attachRoutes(this.app);
    }
  }

  private attachRoutes(app: Application): void {
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

    authenticationController.registerRoutes();
  }

  get services() {
    return {
      passwordManagementService: this.passwordManagementService,
      tokenGenerationService: this.tokenGenerationService,
      tokenVerificationService: this.tokenVerificationService,
    };
  }
}
