import { configService as configServiceToMock } from '../../../core';
import { TokenGenerationService } from '../services/token-generation.service';

jest.mock('../../../core', () => ({
  configService: {
    get: jest.fn(),
  },
}));

// Type assertion for better TypeScript support
const configService = configServiceToMock as jest.Mocked<typeof configServiceToMock>;

describe('TokenGenerationService', () => {
  let service: TokenGenerationService;

  beforeEach(() => {
    // Setup mock return values for JWT config
    configService.get.mockReturnValue({
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

  describe('createAccessToken', () => {
    it('should create a valid access token', async () => {
      const payload = { id: 'user-123' };

      const token = await service.createAccessToken({ payload });

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      expect(configService.get).toHaveBeenCalled();
    });
  });

  describe('createRefreshToken', () => {
    it('should create a valid refresh token', async () => {
      const payload = { id: 'user-123' };

      const token = await service.createRefreshToken({ payload });

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      expect(configService.get).toHaveBeenCalled();
    });
  });
});
