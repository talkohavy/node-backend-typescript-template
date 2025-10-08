import type { PasswordManagementService } from './password-management.service';
import type { TokenGenerationService } from './token-generation.service';
import type { TokenVerificationService } from './token-verification.service';

export class AuthenticationService {
  constructor(
    public readonly passwordManagementService: PasswordManagementService,
    public readonly tokenGenerationService: TokenGenerationService,
    public readonly tokenVerificationService: TokenVerificationService,
  ) {}
}
