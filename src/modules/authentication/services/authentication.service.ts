import { PasswordManagementService } from './password-management.service';
import { TokenGenerationService } from './token-generation.service';
import { TokenVerificationService } from './token-verification.service';

export class AuthenticationService {
  constructor(
    public readonly passwordManagementService: PasswordManagementService,
    public readonly tokenGenerationService: TokenGenerationService,
    public readonly tokenVerificationService: TokenVerificationService,
  ) {}
}
