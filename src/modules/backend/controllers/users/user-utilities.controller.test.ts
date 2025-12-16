import cookieParser from 'cookie-parser';
import express from 'express';
import request from 'supertest';
import type { ConfiguredExpress } from '../../../../common/types';
import type { IAuthAdapter } from '../../adapters/interfaces/auth.adapter.interface';
import type { IUsersAdapter } from '../../adapters/interfaces/users.adapter.interface';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { configService } from '../../../../core';
import { errorHandlerPlugin } from '../../../../plugins/errorHandler.plugin';
import { UserUtilitiesController } from './user-utilities.controller';

jest.mock('../../../../core', () => ({
  configService: {
    get: jest.fn(),
  },
}));

const mockConfigService = configService as jest.Mocked<typeof configService>;

describe('UserUtilitiesController', () => {
  let app: ConfiguredExpress;
  let mockUsersAdapter: jest.Mocked<IUsersAdapter>;
  let mockAuthAdapter: jest.Mocked<IAuthAdapter>;

  beforeEach(() => {
    app = express() as ConfiguredExpress;
    app.use(express.json());
    app.use(cookieParser());

    app.logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;

    mockConfigService.get.mockReturnValue({
      accessCookie: { name: 'accessToken' },
      refreshCookie: { name: 'refreshToken' },
    });

    mockUsersAdapter = {
      getUserById: jest.fn(),
      getUsers: jest.fn(),
      createUser: jest.fn(),
      getUserByEmail: jest.fn(),
      updateUserById: jest.fn(),
      deleteUserById: jest.fn(),
    } as jest.Mocked<IUsersAdapter>;

    mockAuthAdapter = {
      verifyToken: jest.fn(),
      getIsPasswordValid: jest.fn(),
      generateHashedPassword: jest.fn(),
      createTokens: jest.fn(),
    } as jest.Mocked<IAuthAdapter>;

    const controller = new UserUtilitiesController(app, mockUsersAdapter, mockAuthAdapter);
    controller.registerRoutes();
    errorHandlerPlugin(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/get-profile', () => {
    it('should return user profile when valid token provided', async () => {
      const mockDecodedToken = { id: 'user-123' };
      const mockUser = { id: 'user-123', email: 'test@example.com', name: 'Test User' };

      mockAuthAdapter.verifyToken.mockResolvedValue(mockDecodedToken as any);
      mockUsersAdapter.getUserById.mockResolvedValue(mockUser as any);

      const response = await request(app).get(API_URLS.getProfile).set('Cookie', ['accessToken=valid-token']);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockUser);
      expect(mockAuthAdapter.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockUsersAdapter.getUserById).toHaveBeenCalledWith('user-123');
      expect(app.logger.info).toHaveBeenCalledWith(`GET ${API_URLS.getProfile} - get user profile`);
    });

    it('should return 204 when token verification returns null', async () => {
      mockAuthAdapter.verifyToken.mockResolvedValue(null as any);

      const response = await request(app).get(API_URLS.getProfile).set('Cookie', ['accessToken=invalid-token']);

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
      expect(response.body).toEqual({});
      expect(mockUsersAdapter.getUserById).not.toHaveBeenCalled();
    });
  });
});
