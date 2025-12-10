import express from 'express';
import request from 'supertest';
import type { TokenGenerationService } from '../services/token-generation.service';
import { API_URLS, StatusCodes } from '../../../common/constants';
import { logger } from '../../../core';
import { TokenGenerationController } from './token-generation.controller';

jest.mock('../../../core', () => ({
  logger: {
    info: jest.fn(),
  },
}));

jest.mock('../../../middlewares/joi-body.middleware', () => ({
  joiBodyMiddleware: jest.fn(() => (_req: any, _res: any, next: any) => next()),
}));

const mockLogger = logger as jest.Mocked<typeof logger>;

describe('TokenGenerationController', () => {
  let app: express.Application;
  let mockTokenGenerationService: jest.Mocked<TokenGenerationService>;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    mockTokenGenerationService = {
      createTokens: jest.fn(),
      createAccessToken: jest.fn(),
      createRefreshToken: jest.fn(),
    } as any;

    const controller = new TokenGenerationController(app, mockTokenGenerationService);
    controller.attachRoutes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/tokens', () => {
    it('should create and return access and refresh tokens', async () => {
      const requestBody = { userId: 'user-123' };
      const mockTokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      mockTokenGenerationService.createTokens.mockResolvedValue(mockTokens);

      const response = await request(app).post(API_URLS.createTokens).send(requestBody);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockTokens);
      expect(mockTokenGenerationService.createTokens).toHaveBeenCalledWith('user-123');
      expect(mockLogger.info).toHaveBeenCalledWith(`POST ${API_URLS.createTokens} - create tokens`);
    });
  });
});
