import express from 'express';
import request from 'supertest';
import type { PasswordManagementService } from '../services/password-management.service';
import { API_URLS, StatusCodes } from '../../../common/constants';
import { logger } from '../../../core';
import { errorHandlerPlugin } from '../../../plugins/errorHandler.plugin';
import { PasswordManagementController } from './password-management.controller';

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

describe('PasswordManagementController', () => {
  let app: express.Application;
  let mockPasswordManagementService: jest.Mocked<PasswordManagementService>;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    mockPasswordManagementService = {
      getIsPasswordValid: jest.fn(),
      generateHashedPassword: jest.fn(),
    } as any;

    const controller = new PasswordManagementController(app, mockPasswordManagementService);
    controller.registerRoutes();
    errorHandlerPlugin(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/is-password-valid', () => {
    it('should return true when password is valid', async () => {
      const requestBody = {
        hashedPassword: 'salt:hashedPassword',
        password: 'correctPassword',
      };

      mockPasswordManagementService.getIsPasswordValid.mockResolvedValue(true);

      const response = await request(app).post(API_URLS.isPasswordValid).send(requestBody);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({ isValid: true });
      expect(mockPasswordManagementService.getIsPasswordValid).toHaveBeenCalledWith(
        'salt:hashedPassword',
        'correctPassword',
      );
      expect(mockLogger.info).toHaveBeenCalledWith(`POST ${API_URLS.isPasswordValid} - check if password is valid`);
    });

    it('should return false when password is invalid', async () => {
      const requestBody = {
        hashedPassword: 'salt:hashedPassword',
        password: 'wrongPassword',
      };

      mockPasswordManagementService.getIsPasswordValid.mockResolvedValue(false);

      const response = await request(app).post(API_URLS.isPasswordValid).send(requestBody);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({ isValid: false });
      expect(mockPasswordManagementService.getIsPasswordValid).toHaveBeenCalledWith(
        'salt:hashedPassword',
        'wrongPassword',
      );
    });

    it('should throw UnauthorizedError when service throws error', async () => {
      const requestBody = {
        hashedPassword: 'salt:hashedPassword',
        password: 'testPassword',
      };

      mockPasswordManagementService.getIsPasswordValid.mockRejectedValue(new Error('Service error'));

      const response = await request(app).post(API_URLS.isPasswordValid).send(requestBody);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toMatchObject({ message: 'Invalid credentials' });
      expect(mockLogger.error).toHaveBeenCalledWith('Check password validity failed...', expect.any(Object));
    });
  });
});
