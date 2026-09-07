import express, { type Application } from 'express';
import request from 'supertest';
import { API_PATHS, StatusCodes } from '@src/common/constants';
import { errorHandler } from '@src/middlewares/errorHandler.middleware';
import { FeatureFlagAlreadyExistsError, FeatureFlagNotFoundError } from '../../logic/errors';
import { FeatureFlagsCrudController } from './feature-flags-crud.controller';
import type { FeatureFlagsService } from '../../services/feature-flags';
import type { FeatureFlag } from '../../types';

jest.mock('@src/middlewares/joi-body.middleware', () => ({
  joiBodyMiddleware: jest.fn(() => (_req: any, _res: any, next: any) => next()),
}));

describe('FeatureFlagsCrudController', () => {
  let app: Application;
  let mockFeatureFlagsService: jest.Mocked<FeatureFlagsService>;

  const featureFlag: FeatureFlag = {
    id: 1,
    key: 'new-onboarding-flow',
    isEnabled: true,
    description: 'Enables the redesigned onboarding flow',
    createdAt: 1_700_000_000_000,
    updatedAt: 1_700_000_000_000,
  };

  beforeEach(() => {
    app = express() as unknown as Application;
    app.use(express.json());

    app.logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;

    mockFeatureFlagsService = {
      createFeatureFlag: jest.fn(),
      getFeatureFlags: jest.fn(),
      getFeatureFlagByKey: jest.fn(),
      updateFeatureFlag: jest.fn(),
      deleteFeatureFlagByKey: jest.fn(),
    } as any;

    const controller = new FeatureFlagsCrudController(app, mockFeatureFlagsService);
    controller.registerRoutes();
    errorHandler(app);
  });

  describe('POST /api/feature-flags', () => {
    it('creates a feature flag', async () => {
      mockFeatureFlagsService.createFeatureFlag.mockResolvedValue(featureFlag);

      const response = await request(app).post(API_PATHS.featureFlags).send({ key: featureFlag.key, isEnabled: true });

      const expectedResult = featureFlag;
      const actualResult = response.body;

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(actualResult).toEqual(expectedResult);
      expect(app.logger.info).toHaveBeenCalledWith(`POST ${API_PATHS.featureFlags} - creating feature flag`);
    });

    it('returns conflict when the flag already exists', async () => {
      mockFeatureFlagsService.createFeatureFlag.mockRejectedValue(new FeatureFlagAlreadyExistsError(featureFlag.key));

      const response = await request(app).post(API_PATHS.featureFlags).send({ key: featureFlag.key });

      expect(response.status).toBe(StatusCodes.CONFLICT);
    });
  });

  describe('GET /api/feature-flags', () => {
    it('returns all feature flags', async () => {
      mockFeatureFlagsService.getFeatureFlags.mockResolvedValue([featureFlag]);

      const response = await request(app).get(API_PATHS.featureFlags);

      const expectedResult = [featureFlag];
      const actualResult = response.body;

      expect(response.status).toBe(StatusCodes.OK);
      expect(actualResult).toEqual(expectedResult);
      expect(app.logger.info).toHaveBeenCalledWith(`GET ${API_PATHS.featureFlags} - listing feature flags`);
    });
  });

  describe('GET /api/feature-flags/:key', () => {
    it('returns a feature flag by key', async () => {
      mockFeatureFlagsService.getFeatureFlagByKey.mockResolvedValue(featureFlag);

      const response = await request(app).get(`${API_PATHS.featureFlags}/${featureFlag.key}`);

      const expectedResult = featureFlag;
      const actualResult = response.body;

      expect(response.status).toBe(StatusCodes.OK);
      expect(actualResult).toEqual(expectedResult);
    });

    it('returns not found when the flag does not exist', async () => {
      mockFeatureFlagsService.getFeatureFlagByKey.mockRejectedValue(new FeatureFlagNotFoundError('missing'));

      const response = await request(app).get(`${API_PATHS.featureFlags}/missing`);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('PATCH /api/feature-flags/:key', () => {
    it('updates a feature flag', async () => {
      const updatedFlag = { ...featureFlag, isEnabled: false };
      mockFeatureFlagsService.updateFeatureFlag.mockResolvedValue(updatedFlag);

      const response = await request(app)
        .patch(`${API_PATHS.featureFlags}/${featureFlag.key}`)
        .send({ isEnabled: false });

      const expectedResult = updatedFlag;
      const actualResult = response.body;

      expect(response.status).toBe(StatusCodes.OK);
      expect(actualResult).toEqual(expectedResult);
    });

    it('returns not found when the flag does not exist', async () => {
      mockFeatureFlagsService.updateFeatureFlag.mockRejectedValue(new FeatureFlagNotFoundError('missing'));

      const response = await request(app).patch(`${API_PATHS.featureFlags}/missing`).send({ isEnabled: true });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE /api/feature-flags/:key', () => {
    it('deletes a feature flag', async () => {
      mockFeatureFlagsService.deleteFeatureFlagByKey.mockResolvedValue(true);

      const response = await request(app).delete(`${API_PATHS.featureFlags}/${featureFlag.key}`);

      const expectedResult = { success: true };
      const actualResult = response.body;

      expect(response.status).toBe(StatusCodes.OK);
      expect(actualResult).toEqual(expectedResult);
    });

    it('returns not found when the flag does not exist', async () => {
      mockFeatureFlagsService.deleteFeatureFlagByKey.mockRejectedValue(new FeatureFlagNotFoundError('missing'));

      const response = await request(app).delete(`${API_PATHS.featureFlags}/missing`);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
