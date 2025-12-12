import express from 'express';
import request from 'supertest';
import type { AuthenticationNetworkService as AuthenticationNetworkServiceToMock } from '../../services/authentication/authentication.network.service';
import type { UserUtilitiesNetworkService as UserUtilitiesNetworkServiceToMock } from '../../services/users/user-utilities.network.service';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { configService as configServiceToMock, logger as loggerToMock } from '../../../../core';
import { errorHandlerPlugin } from '../../../../plugins/errorHandler.plugin';
import { AuthenticationController } from './authentication.controller';

jest.mock('../../../../core', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
  configService: {
    get: jest.fn(),
  },
}));

jest.mock('../../../../middlewares/joi-body.middleware', () => ({
  joiBodyMiddleware: jest.fn(() => (_req: any, _res: any, next: any) => next()),
}));

const logger = loggerToMock as jest.Mocked<typeof loggerToMock>;
const configService = configServiceToMock as jest.Mocked<typeof configServiceToMock>;

describe('AuthenticationController', () => {
  let app: express.Application;
  let authenticationNetworkService: jest.Mocked<AuthenticationNetworkServiceToMock>;
  let userUtilitiesNetworkService: jest.Mocked<UserUtilitiesNetworkServiceToMock>;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    configService.get.mockImplementation((key: any) => {
      if (key === '') {
        return {
          cookies: {
            accessCookie: { name: 'accessToken', maxAge: 900000 },
            refreshCookie: { name: 'refreshToken', maxAge: 604800000 },
          },
          isDev: true,
        };
      }
      return {
        accessCookie: { name: 'accessToken', maxAge: 900000 },
        refreshCookie: { name: 'refreshToken', maxAge: 604800000 },
      };
    });

    authenticationNetworkService = {
      passwordManagementService: {
        getIsPasswordValid: jest.fn(),
        generateHashedPassword: jest.fn(),
      },
      tokenGenerationService: {
        createTokens: jest.fn(),
        createAccessToken: jest.fn(),
        createRefreshToken: jest.fn(),
      },
      tokenVerificationService: {
        verifyToken: jest.fn(),
      },
    } as any;
    userUtilitiesNetworkService = {
      getUserByEmail: jest.fn(),
    } as any;

    const controller = new AuthenticationController(app, authenticationNetworkService, userUtilitiesNetworkService);
    controller.registerRoutes();
    errorHandlerPlugin(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully and set cookies', async () => {
      const mockUser = { id: 123, email: 'test@example.com', hashed_password: 'salt:hash' };
      const mockTokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

      userUtilitiesNetworkService.getUserByEmail.mockResolvedValue(mockUser as any);
      (authenticationNetworkService.passwordManagementService.getIsPasswordValid as jest.Mock).mockResolvedValue(true);
      (authenticationNetworkService.tokenGenerationService.createTokens as jest.Mock).mockResolvedValue(mockTokens);

      const response = await request(app)
        .post(API_URLS.authLogin)
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockUser);
      expect(userUtilitiesNetworkService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(authenticationNetworkService.passwordManagementService.getIsPasswordValid).toHaveBeenCalledWith(
        'salt:hash',
        'password123',
      );
      expect(authenticationNetworkService.tokenGenerationService.createTokens).toHaveBeenCalledWith('123');
      expect(response.headers['set-cookie']).toBeDefined();
      expect(logger.info).toHaveBeenCalledWith(`POST ${API_URLS.authLogin} - user login endpoint`);
    });

    it('should return 404 when user not found', async () => {
      userUtilitiesNetworkService.getUserByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post(API_URLS.authLogin)
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({ message: 'User not found' });
      expect(authenticationNetworkService.passwordManagementService.getIsPasswordValid).not.toHaveBeenCalled();
    });

    it('should return 401 when password is invalid', async () => {
      const mockUser = { id: 123, email: 'test@example.com', hashed_password: 'salt:hash' };

      userUtilitiesNetworkService.getUserByEmail.mockResolvedValue(mockUser as any);
      (authenticationNetworkService.passwordManagementService.getIsPasswordValid as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post(API_URLS.authLogin)
        .send({ email: 'test@example.com', password: 'wrongPassword' });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({ message: 'Invalid credentials' });
      expect(authenticationNetworkService.tokenGenerationService.createTokens).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/auth/logout', () => {
    it('should logout successfully and clear cookies', async () => {
      const response = await request(app).get(API_URLS.authLogout);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({});
      expect(response.headers['set-cookie']).toBeDefined();
      expect(logger.info).toHaveBeenCalledWith(`GET ${API_URLS.authLogout} - user logout`);
    });
  });
});
