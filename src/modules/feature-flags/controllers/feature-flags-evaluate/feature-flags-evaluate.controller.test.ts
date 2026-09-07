import express, { type Application } from 'express';
import request from 'supertest';
import { API_PATHS, StatusCodes } from '@src/common/constants';
import { errorHandler } from '@src/middlewares/errorHandler.middleware';
import { FeatureFlagNotFoundError } from '../../logic/errors';
import { FeatureFlagsEvaluateController } from './feature-flags-evaluate.controller';
import type { FeatureFlagsService } from '../../services/feature-flags';
import type { FeatureFlag } from '../../types';

jest.mock('@src/middlewares/joi-body.middleware', () => ({
  joiBodyMiddleware: jest.fn(() => (_req: any, _res: any, next: any) => next()),
}));

describe('FeatureFlagsEvaluateController', () => {
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
      evaluateFeatureFlags: jest.fn(),
      getFeatureFlagByKey: jest.fn(),
    } as any;

    const controller = new FeatureFlagsEvaluateController(app, mockFeatureFlagsService);
    controller.registerRoutes();
    errorHandler(app);
  });

  describe('POST /api/feature-flags/evaluate', () => {
    it('evaluates feature flags', async () => {
      const evaluation = { featureFlags: { 'new-onboarding-flow': true } };
      mockFeatureFlagsService.evaluateFeatureFlags.mockResolvedValue(evaluation);

      const response = await request(app)
        .post(API_PATHS.evaluateFeatureFlags)
        .send({ keys: [featureFlag.key] });

      const expectedResult = evaluation;
      const actualResult = response.body;

      expect(response.status).toBe(StatusCodes.OK);
      expect(actualResult).toEqual(expectedResult);
      expect(app.logger.info).toHaveBeenCalledWith(`POST ${API_PATHS.evaluateFeatureFlags} - evaluating feature flags`);
    });
  });

  describe('GET /api/feature-flags/:key/enabled', () => {
    it('returns the feature flag', async () => {
      mockFeatureFlagsService.getFeatureFlagByKey.mockResolvedValue(featureFlag);

      const response = await request(app).get(`${API_PATHS.featureFlags}/${featureFlag.key}/enabled`);

      const expectedResult = featureFlag;
      const actualResult = response.body;

      expect(response.status).toBe(StatusCodes.OK);
      expect(actualResult).toEqual(expectedResult);
    });

    it('returns not found when the flag does not exist', async () => {
      mockFeatureFlagsService.getFeatureFlagByKey.mockRejectedValue(new FeatureFlagNotFoundError('missing'));

      const response = await request(app).get(`${API_PATHS.featureFlags}/missing/enabled`);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
