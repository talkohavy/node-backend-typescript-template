import express from 'express';
import request from 'supertest';
import type { ConfiguredExpress } from '../../../../common/types';
import type { IAuthAdapter } from '../../adapters/interfaces/auth.adapter.interface';
import type { IUsersAdapter } from '../../adapters/interfaces/users.adapter.interface';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { configService as configServiceToMock } from '../../../../core';
import { errorHandlerPlugin } from '../../../../plugins/errorHandler.plugin';
import { AuthenticationController } from './authentication.controller';

jest.mock('../../../../core', () => ({
  configService: {
    get: jest.fn(),
  },
}));

jest.mock('../../../../middlewares/joi-body.middleware', () => ({
  joiBodyMiddleware: jest.fn(() => (_req: any, _res: any, next: any) => next()),
}));

const configService = configServiceToMock as jest.Mocked<typeof configServiceToMock>;

describe('AuthenticationController', () => {
  let app: ConfiguredExpress;
  let mockAuthAdapter: jest.Mocked<IAuthAdapter>;
  let mockUsersAdapter: jest.Mocked<IUsersAdapter>;

  beforeEach(() => {
    app = express() as ConfiguredExpress;
    app.use(express.json());

    app.logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;

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

    mockAuthAdapter = {
      getIsPasswordValid: jest.fn(),
      generateHashedPassword: jest.fn(),
      createTokens: jest.fn(),
      verifyToken: jest.fn(),
    } as jest.Mocked<IAuthAdapter>;

    mockUsersAdapter = {
      getUserByEmail: jest.fn(),
      getUserById: jest.fn(),
      getUsers: jest.fn(),
      createUser: jest.fn(),
      updateUserById: jest.fn(),
      deleteUserById: jest.fn(),
    } as jest.Mocked<IUsersAdapter>;

    const controller = new AuthenticationController(app, mockAuthAdapter, mockUsersAdapter);
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

      mockUsersAdapter.getUserByEmail.mockResolvedValue(mockUser as any);
      mockAuthAdapter.getIsPasswordValid.mockResolvedValue(true);
      mockAuthAdapter.createTokens.mockResolvedValue(mockTokens);

      const response = await request(app)
        .post(API_URLS.authLogin)
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockUser);
      expect(mockUsersAdapter.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockAuthAdapter.getIsPasswordValid).toHaveBeenCalledWith('salt:hash', 'password123');
      expect(mockAuthAdapter.createTokens).toHaveBeenCalledWith('123');
      expect(response.headers['set-cookie']).toBeDefined();
      expect(app.logger.info).toHaveBeenCalledWith(`POST ${API_URLS.authLogin} - user login endpoint`);
    });

    it('should return 404 when user not found', async () => {
      mockUsersAdapter.getUserByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post(API_URLS.authLogin)
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({ message: 'User not found' });
      expect(mockAuthAdapter.getIsPasswordValid).not.toHaveBeenCalled();
    });

    it('should return 401 when password is invalid', async () => {
      const mockUser = { id: 123, email: 'test@example.com', hashed_password: 'salt:hash' };

      mockUsersAdapter.getUserByEmail.mockResolvedValue(mockUser as any);
      mockAuthAdapter.getIsPasswordValid.mockResolvedValue(false);

      const response = await request(app)
        .post(API_URLS.authLogin)
        .send({ email: 'test@example.com', password: 'wrongPassword' });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({ message: 'Invalid credentials' });
      expect(mockAuthAdapter.createTokens).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/auth/logout', () => {
    it('should logout successfully and clear cookies', async () => {
      const response = await request(app).get(API_URLS.authLogout);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({});
      expect(response.headers['set-cookie']).toBeDefined();
      expect(app.logger.info).toHaveBeenCalledWith(`GET ${API_URLS.authLogout} - user logout`);
    });
  });
});
