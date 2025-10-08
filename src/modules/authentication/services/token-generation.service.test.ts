import { configService } from '../../../core';
import { TokenGenerationService } from '../services/token-generation.service';

jest.mock('../../../core', () => ({
  configService: {
    get: jest.fn(),
  },
}));

// Type assertion for better TypeScript support
const mockConfigService = configService as jest.Mocked<typeof configService>;

describe('TokenGenerationService', () => {
  let service: TokenGenerationService;

  beforeEach(() => {
    // Setup mock return values for JWT config
    mockConfigService.get.mockReturnValue({
      accessSecret: 'test-access-secret',
      refreshSecret: 'test-refresh-secret',
      accessExpireTime: '15m',
      refreshExpireTime: '7d',
      issuer: 'test-issuer',
    });

    service = new TokenGenerationService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTokens', () => {
    it('should create access and refresh tokens', async () => {
      const userId = 'test-user-123';

      const result = await service.createTokens(userId);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
      expect(result.accessToken.length).toBeGreaterThan(0);
      expect(result.refreshToken.length).toBeGreaterThan(0);
    });
  });
});
