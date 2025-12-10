import express from 'express';
import request from 'supertest';
import type { UserUtilitiesService } from '../services/user-utilities.service';
import { API_URLS, StatusCodes } from '../../../common/constants';
import { logger } from '../../../core';
import { errorHandlerPlugin } from '../../../plugins/errorHandler.plugin';
import { UserNotFoundError } from '../logic/users.errors';
import { UserUtilitiesController } from './user-utilities.controller';

jest.mock('../../../core', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../../middlewares/joi-body.middleware', () => ({
  joiBodyMiddleware: jest.fn(() => (_req: any, _res: any, next: any) => next()),
}));

const mockLogger = logger as jest.Mocked<typeof logger>;

describe('UserUtilitiesController', () => {
  let app: express.Application;
  let mockUserUtilitiesService: jest.Mocked<UserUtilitiesService>;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    mockUserUtilitiesService = {
      getUserByEmail: jest.fn(),
    } as any;

    const controller = new UserUtilitiesController(app, mockUserUtilitiesService);
    controller.attachRoutes();
    errorHandlerPlugin(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/get-by-email', () => {
    it('should return user when found by email', async () => {
      const mockUser = { id: '123', email: 'test@example.com', name: 'Test User' };

      (mockUserUtilitiesService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post(API_URLS.getUserByEmail).send({ email: 'test@example.com' });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(mockUser);
      expect(mockUserUtilitiesService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockLogger.info).toHaveBeenCalledWith('POST /users/get-by-email - fetching user by email');
    });

    it('should throw NotFoundError when user not found', async () => {
      const userNotFoundError = new UserNotFoundError('test@example.com');

      (mockUserUtilitiesService.getUserByEmail as jest.Mock).mockRejectedValue(userNotFoundError);

      const response = await request(app).post(API_URLS.getUserByEmail).send({ email: 'test@example.com' });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(mockUserUtilitiesService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });
});
