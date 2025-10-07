import { ControllerFactory } from '../../../lib/lucky-server';
import { PasswordManagementController } from './password-management.controller';
import { SessionManagementController } from './session-management.controller';
import { TokenGenerationController } from './token-generation.controller';
import { TokenVerificationController } from './token-verification.controller';

export class AuthenticationController implements ControllerFactory {
  constructor(
    private readonly passwordManagementController: PasswordManagementController,
    private readonly tokenGenerationController: TokenGenerationController,
    private readonly tokenVerificationController: TokenVerificationController,
    private readonly sessionManagementController: SessionManagementController,
  ) {}

  attachRoutes() {
    this.passwordManagementController.attachRoutes();
    this.tokenGenerationController.attachRoutes();
    this.tokenVerificationController.attachRoutes();
    this.sessionManagementController.attachRoutes();
  }
}
