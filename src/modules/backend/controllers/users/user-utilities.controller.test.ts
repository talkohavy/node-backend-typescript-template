import cookieParser from 'cookie-parser';
import express from 'express';
import request from 'supertest';
import type { AuthenticationNetworkService } from '../../services/authentication/authentication.network.service';
import type { UsersNetworkService } from '../../services/users/users.network.service';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { configService, logger } from '../../../../core';
import { errorHandlerPlugin } from '../../../../plugins/errorHandler.plugin';
import { UserUtilitiesController } from './user-utilities.controller';

jest.mock('../../../../core', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
  configService: {
    get: jest.fn(),
  },
}));

const mockLogger = logger as jest.Mocked<typeof logger>;
const mockConfigService = configService as jest.Mocked<typeof configService>;

describe('UserUtilitiesController', () => {
  let app: express.Application;
  let mockUsersNetworkService: jest.Mocked<UsersNetworkService>;
  let mockAuthenticationNetworkService: jest.Mocked<AuthenticationNetworkService>;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());

    mockConfigService.get.mockReturnValue({
      accessCookie: { name: 'accessToken' },
      refreshCookie: { name: 'refreshToken' },
    });

    mockUsersNetworkService = {
      crudService: {
        getUserById: jest.fn(),
        getUsers: jest.fn(),
        createUser: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
      },
    } as any;

    mockAuthenticationNetworkService = {
      tokenVerificationService: {
        verifyToken: jest.fn(),
      },
      passwordManagementService: {
        getIsPasswordValid: jest.fn(),
        generateHashedPassword: jest.fn(),
      },
      tokenGenerationService: {
        createTokens: jest.fn(),
        createAccessToken: jest.fn(),
        createRefreshToken: jest.fn(),
      },
    } as any;

    const controller = new UserUtilitiesController(app, mockUsersNetworkService, mockAuthenticationNetworkService);
    controller.registerRoutes();
    errorHandlerPlugin(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/profile', () => {
    it('should return user profile when valid token provided', async () => {
      const mockDecodedToken = { id: 'user-123' };
      const mockUser = { id: 'user-123', email: 'test@example.com', name: 'Test User' };

      (mockAuthenticationNetworkService.tokenVerificationService.verifyToken as jest.Mock).mockResolvedValue(
        mockDecodedToken,
      );
      (mockUsersNetworkService.crudService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).get(API_URLS.getProfile).set('Cookie', ['accessToken=valid-token']);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockUser);
      expect(mockAuthenticationNetworkService.tokenVerificationService.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockUsersNetworkService.crudService.getUserById).toHaveBeenCalledWith('user-123');
      expect(mockLogger.info).toHaveBeenCalledWith(`GET ${API_URLS.getProfile} - get user profile`);
    });

    it('should return 204 when token verification returns null', async () => {
      (mockAuthenticationNetworkService.tokenVerificationService.verifyToken as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get(API_URLS.getProfile).set('Cookie', ['accessToken=invalid-token']);

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
      expect(response.body).toEqual({});
      expect(mockUsersNetworkService.crudService.getUserById).not.toHaveBeenCalled();
    });
  });
});
