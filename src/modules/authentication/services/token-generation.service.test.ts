import { TokenGenerationService } from '../services/token-generation.service';

describe('TokenGenerationService', () => {
  let service: TokenGenerationService;

  beforeEach(() => {
    service = new TokenGenerationService();
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
