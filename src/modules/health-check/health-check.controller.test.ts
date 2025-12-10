import express from 'express';
import request from 'supertest';
import { API_URLS } from '../../common/constants';
import { logger } from '../../core';
import { HealthCheckController } from './health-check.controller';

jest.mock('../../core', () => ({
  logger: {
    info: jest.fn(),
  },
}));

const mockLogger = logger as jest.Mocked<typeof logger>;

describe('HealthCheckController', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    const controller = new HealthCheckController(app);
    controller.attachRoutes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return status OK when health check endpoint is called', async () => {
    const response = await request(app).get(API_URLS.healthCheck);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
    expect(mockLogger.info).toHaveBeenCalledWith(`GET ${API_URLS.healthCheck} - performing health check`);
  });
});
