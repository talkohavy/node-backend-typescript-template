import { PasswordManagementNetworkService } from './password-management.network.service';
import { TokenGenerationNetworkService } from './token-generation.network.service';
import { TokenVerificationNetworkService } from './token-verification.network.service';

export class AuthenticationNetworkService {
  constructor(
    public readonly passwordManagementService: PasswordManagementNetworkService,
    public readonly tokenGenerationService: TokenGenerationNetworkService,
    public readonly tokenVerificationService: TokenVerificationNetworkService,
  ) {}
}
