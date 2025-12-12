import cookieParser from 'cookie-parser';
import express from 'express';
import request from 'supertest';
import type { AuthenticationNetworkService } from '../../services/authentication/authentication.network.service';
import type { UsersNetworkService } from '../../services/users/users.network.service';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { configService, logger } from '../../../../core';
import { errorHandlerPlugin } from '../../../../plugins/errorHandler.plugin';
import { UsersCrudController } from './users-crud.controller';

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

const mockLogger = logger as jest.Mocked<typeof logger>;
const mockConfigService = configService as jest.Mocked<typeof configService>;

describe('UsersCrudController', () => {
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
        updateUserById: jest.fn(),
        deleteUserById: jest.fn(),
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

    const controller = new UsersCrudController(app, mockUsersNetworkService, mockAuthenticationNetworkService);
    controller.registerRoutes();
    errorHandlerPlugin(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = { email: 'test@example.com', name: 'Test User', password: 'password123' };
      const createdUser = { id: '123', ...newUser };

      (mockUsersNetworkService.crudService.createUser as jest.Mock).mockResolvedValue(createdUser);

      const response = await request(app).post(API_URLS.users).send(newUser);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toEqual(createdUser);
      expect(mockUsersNetworkService.crudService.createUser).toHaveBeenCalledWith(newUser);
      expect(mockLogger.info).toHaveBeenCalledWith(`POST ${API_URLS.users} - create new user`);
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', name: 'User 1' },
        { id: '2', email: 'user2@example.com', name: 'User 2' },
      ];

      (mockUsersNetworkService.crudService.getUsers as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get(API_URLS.users);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockUsers);
      expect(mockUsersNetworkService.crudService.getUsers).toHaveBeenCalledWith({});
      expect(mockLogger.info).toHaveBeenCalledWith(`GET ${API_URLS.users} - get all users`);
    });
  });

  describe('GET /api/users/:userId', () => {
    it('should return user by id', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com', name: 'Test User' };

      (mockUsersNetworkService.crudService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).get('/api/users/user-123');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockUser);
      expect(mockUsersNetworkService.crudService.getUserById).toHaveBeenCalledWith('user-123');
      expect(mockLogger.info).toHaveBeenCalledWith(`GET ${API_URLS.userById} - get user by id`);
    });
  });

  describe('PATCH /api/users/:userId', () => {
    it('should update user when authorized', async () => {
      const userId = 'user-123';
      const mockDecodedToken = { id: userId };
      const updateData = { name: 'Updated Name' };
      const updatedUser = { id: userId, email: 'test@example.com', name: 'Updated Name' };

      (mockAuthenticationNetworkService.tokenVerificationService.verifyToken as jest.Mock).mockResolvedValue(
        mockDecodedToken,
      );
      (mockUsersNetworkService.crudService.updateUserById as jest.Mock).mockResolvedValue(updatedUser);

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .set('Cookie', ['accessToken=valid-token'])
        .send(updateData);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(updatedUser);
      expect(mockAuthenticationNetworkService.tokenVerificationService.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockUsersNetworkService.crudService.updateUserById).toHaveBeenCalledWith(userId, updateData);
      expect(mockLogger.info).toHaveBeenCalledWith(`PATCH ${API_URLS.userById} - updating user by ID`);
    });

    it('should throw UnauthorizedError when token is invalid', async () => {
      (mockAuthenticationNetworkService.tokenVerificationService.verifyToken as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .patch('/api/users/user-123')
        .set('Cookie', ['accessToken=invalid-token'])
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(mockUsersNetworkService.crudService.updateUserById).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenError when user tries to update another user', async () => {
      const mockDecodedToken = { id: 'user-123' };

      (mockAuthenticationNetworkService.tokenVerificationService.verifyToken as jest.Mock).mockResolvedValue(
        mockDecodedToken,
      );

      const response = await request(app)
        .patch('/api/users/user-456')
        .set('Cookie', ['accessToken=valid-token'])
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
      expect(mockUsersNetworkService.crudService.updateUserById).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('should delete user when authorized', async () => {
      const userId = 'user-123';
      const mockDecodedToken = { id: userId };
      const deleteResult = { success: true };

      (mockAuthenticationNetworkService.tokenVerificationService.verifyToken as jest.Mock).mockResolvedValue(
        mockDecodedToken,
      );
      (mockUsersNetworkService.crudService.deleteUserById as jest.Mock).mockResolvedValue(deleteResult);

      const response = await request(app).delete(`/api/users/${userId}`).set('Cookie', ['accessToken=valid-token']);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(deleteResult);
      expect(mockAuthenticationNetworkService.tokenVerificationService.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockUsersNetworkService.crudService.deleteUserById).toHaveBeenCalledWith(userId);
      expect(mockLogger.info).toHaveBeenCalledWith(`DELETE ${API_URLS.userById} - delete user`);
    });

    it('should throw UnauthorizedError when token is invalid', async () => {
      (mockAuthenticationNetworkService.tokenVerificationService.verifyToken as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/api/users/user-123').set('Cookie', ['accessToken=invalid-token']);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(mockUsersNetworkService.crudService.deleteUserById).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenError when user tries to delete another user', async () => {
      const mockDecodedToken = { id: 'user-123' };

      (mockAuthenticationNetworkService.tokenVerificationService.verifyToken as jest.Mock).mockResolvedValue(
        mockDecodedToken,
      );

      const response = await request(app).delete('/api/users/user-456').set('Cookie', ['accessToken=valid-token']);

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
      expect(mockUsersNetworkService.crudService.deleteUserById).not.toHaveBeenCalled();
    });
  });
});
