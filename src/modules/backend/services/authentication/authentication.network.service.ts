import type { PasswordManagementNetworkService } from './password-management.network.service';
import type { TokenGenerationNetworkService } from './token-generation.network.service';
import type { TokenVerificationNetworkService } from './token-verification.network.service';

export class AuthenticationNetworkService {
  constructor(
    public readonly passwordManagementService: PasswordManagementNetworkService,
    public readonly tokenGenerationService: TokenGenerationNetworkService,
    public readonly tokenVerificationService: TokenVerificationNetworkService,
  ) {}
}
