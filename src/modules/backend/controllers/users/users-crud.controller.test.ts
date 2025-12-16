import cookieParser from 'cookie-parser';
import express from 'express';
import request from 'supertest';
import type { ConfiguredExpress } from '../../../../common/types';
import type { IAuthAdapter } from '../../adapters/interfaces/auth.adapter.interface';
import type { IUsersAdapter } from '../../adapters/interfaces/users.adapter.interface';
import { API_URLS, StatusCodes } from '../../../../common/constants';
import { configService } from '../../../../core';
import { errorHandlerPlugin } from '../../../../plugins/errorHandler.plugin';
import { UsersCrudController } from './users-crud.controller';

jest.mock('../../../../core', () => ({
  configService: {
    get: jest.fn(),
  },
}));

jest.mock('../../../../middlewares/joi-body.middleware', () => ({
  joiBodyMiddleware: jest.fn(() => (_req: any, _res: any, next: any) => next()),
}));

const mockConfigService = configService as jest.Mocked<typeof configService>;

describe('UsersCrudController', () => {
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

    const controller = new UsersCrudController(app, mockUsersAdapter, mockAuthAdapter);
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

      mockUsersAdapter.createUser.mockResolvedValue(createdUser as any);

      const response = await request(app).post(API_URLS.users).send(newUser);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toEqual(createdUser);
      expect(mockUsersAdapter.createUser).toHaveBeenCalledWith(newUser);
      expect(app.logger.info).toHaveBeenCalledWith(`POST ${API_URLS.users} - create new user`);
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', name: 'User 1' },
        { id: '2', email: 'user2@example.com', name: 'User 2' },
      ];

      mockUsersAdapter.getUsers.mockResolvedValue(mockUsers as any);

      const response = await request(app).get(API_URLS.users);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockUsers);
      expect(mockUsersAdapter.getUsers).toHaveBeenCalledWith({});
      expect(app.logger.info).toHaveBeenCalledWith(`GET ${API_URLS.users} - get all users`);
    });
  });

  describe('GET /api/users/:userId', () => {
    it('should return user by id', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com', name: 'Test User' };

      mockUsersAdapter.getUserById.mockResolvedValue(mockUser as any);

      const response = await request(app).get('/api/users/user-123');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockUser);
      expect(mockUsersAdapter.getUserById).toHaveBeenCalledWith('user-123');
      expect(app.logger.info).toHaveBeenCalledWith(`GET ${API_URLS.userById} - get user by id`);
    });
  });

  describe('PATCH /api/users/:userId', () => {
    it('should update user when authorized', async () => {
      const userId = 'user-123';
      const mockDecodedToken = { id: userId };
      const updateData = { name: 'Updated Name' };
      const updatedUser = { id: userId, email: 'test@example.com', name: 'Updated Name' };

      mockAuthAdapter.verifyToken.mockResolvedValue(mockDecodedToken as any);
      mockUsersAdapter.updateUserById.mockResolvedValue(updatedUser as any);

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .set('Cookie', ['accessToken=valid-token'])
        .send(updateData);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(updatedUser);
      expect(mockAuthAdapter.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockUsersAdapter.updateUserById).toHaveBeenCalledWith(userId, updateData);
      expect(app.logger.info).toHaveBeenCalledWith(`PATCH ${API_URLS.userById} - updating user by ID`);
    });

    it('should throw UnauthorizedError when token is invalid', async () => {
      mockAuthAdapter.verifyToken.mockResolvedValue(null as any);

      const response = await request(app)
        .patch('/api/users/user-123')
        .set('Cookie', ['accessToken=invalid-token'])
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(mockUsersAdapter.updateUserById).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenError when user tries to update another user', async () => {
      const mockDecodedToken = { id: 'user-123' };

      mockAuthAdapter.verifyToken.mockResolvedValue(mockDecodedToken as any);

      const response = await request(app)
        .patch('/api/users/user-456')
        .set('Cookie', ['accessToken=valid-token'])
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
      expect(mockUsersAdapter.updateUserById).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('should delete user when authorized', async () => {
      const userId = 'user-123';
      const mockDecodedToken = { id: userId };
      const deleteResult = { success: true };

      mockAuthAdapter.verifyToken.mockResolvedValue(mockDecodedToken as any);
      mockUsersAdapter.deleteUserById.mockResolvedValue(deleteResult);

      const response = await request(app).delete(`/api/users/${userId}`).set('Cookie', ['accessToken=valid-token']);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(deleteResult);
      expect(mockAuthAdapter.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockUsersAdapter.deleteUserById).toHaveBeenCalledWith(userId);
      expect(app.logger.info).toHaveBeenCalledWith(`DELETE ${API_URLS.userById} - delete user`);
    });

    it('should throw UnauthorizedError when token is invalid', async () => {
      mockAuthAdapter.verifyToken.mockResolvedValue(null as any);

      const response = await request(app).delete('/api/users/user-123').set('Cookie', ['accessToken=invalid-token']);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(mockUsersAdapter.deleteUserById).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenError when user tries to delete another user', async () => {
      const mockDecodedToken = { id: 'user-123' };

      mockAuthAdapter.verifyToken.mockResolvedValue(mockDecodedToken as any);

      const response = await request(app).delete('/api/users/user-456').set('Cookie', ['accessToken=valid-token']);

      expect(response.status).toBe(StatusCodes.FORBIDDEN);
      expect(mockUsersAdapter.deleteUserById).not.toHaveBeenCalled();
    });
  });
});
