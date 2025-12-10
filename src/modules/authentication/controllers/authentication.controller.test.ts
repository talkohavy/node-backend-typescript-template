import type { PasswordManagementController } from './password-management.controller';
import type { SessionManagementController } from './session-management.controller';
import type { TokenGenerationController } from './token-generation.controller';
import type { TokenVerificationController } from './token-verification.controller';
import { AuthenticationController } from './authentication.controller';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let mockPasswordManagementController: jest.Mocked<PasswordManagementController>;
  let mockTokenGenerationController: jest.Mocked<TokenGenerationController>;
  let mockTokenVerificationController: jest.Mocked<TokenVerificationController>;
  let mockSessionManagementController: jest.Mocked<SessionManagementController>;

  beforeEach(() => {
    mockPasswordManagementController = {
      attachRoutes: jest.fn(),
    } as any;

    mockTokenGenerationController = {
      attachRoutes: jest.fn(),
    } as any;

    mockTokenVerificationController = {
      attachRoutes: jest.fn(),
    } as any;

    mockSessionManagementController = {
      attachRoutes: jest.fn(),
    } as any;

    controller = new AuthenticationController(
      mockPasswordManagementController,
      mockTokenGenerationController,
      mockTokenVerificationController,
      mockSessionManagementController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call attachRoutes on all sub-controllers', () => {
    controller.attachRoutes();

    expect(mockPasswordManagementController.attachRoutes).toHaveBeenCalledTimes(1);
    expect(mockTokenGenerationController.attachRoutes).toHaveBeenCalledTimes(1);
    expect(mockTokenVerificationController.attachRoutes).toHaveBeenCalledTimes(1);
    expect(mockSessionManagementController.attachRoutes).toHaveBeenCalledTimes(1);
  });
});
