import express from 'express';
import request from 'supertest';
import type { ConfiguredExpress } from '../../common/types';
import { API_URLS, StatusCodes } from '../../common/constants';
import { HealthCheckController } from './health-check.controller';

jest.mock('../../core', () => ({
  logger: {
    info: jest.fn(),
  },
}));

describe('HealthCheckController', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express() as ConfiguredExpress;

    app.logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;

    const controller = new HealthCheckController(app);
    controller.registerRoutes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return status OK when health check endpoint is called', async () => {
    const response = await request(app).get(API_URLS.healthCheck);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual({ status: 'OK' });
    expect(app.logger.info).toHaveBeenCalledWith(`GET ${API_URLS.healthCheck} - performing health check`);
  });
});
