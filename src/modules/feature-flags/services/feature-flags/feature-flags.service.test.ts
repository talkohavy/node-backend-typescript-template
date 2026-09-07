import { FeatureFlagAlreadyExistsError, FeatureFlagNotFoundError } from '../../logic/errors';
import { FeatureFlagsService } from './feature-flags.service';
import type { FeatureFlagDB, FeatureFlagsRepository } from '../../repositories/feature-flags';
import type { FeatureFlag } from '../../types';
import type { DataTransformerService } from '../data-transformer';

describe('FeatureFlagsService', () => {
  let featureFlagsService: FeatureFlagsService;
  let mockFeatureFlagsRepository: jest.Mocked<FeatureFlagsRepository>;
  let mockDataTransformerService: jest.Mocked<DataTransformerService>;

  const flag: FeatureFlagDB = {
    id: 1,
    key: 'new-onboarding-flow',
    is_enabled: true,
    description: 'Enables the redesigned onboarding flow',
    created_at: new Date(1_700_000_000_000),
    updated_at: new Date(1_700_000_000_000),
  };

  const transformedFlag: FeatureFlag = {
    id: 1,
    key: 'new-onboarding-flow',
    isEnabled: true,
    description: 'Enables the redesigned onboarding flow',
    createdAt: 1_700_000_000_000,
    updatedAt: 1_700_000_000_000,
  };

  beforeEach(() => {
    mockFeatureFlagsRepository = {
      getAll: jest.fn(),
      getByKey: jest.fn(),
      getByKeys: jest.fn(),
      create: jest.fn(),
      updateByKey: jest.fn(),
      deleteByKey: jest.fn(),
    } as any;

    mockDataTransformerService = {
      transformOneToData: jest.fn(),
      transformMultiToData: jest.fn(),
    } as any;

    featureFlagsService = new FeatureFlagsService(mockFeatureFlagsRepository, mockDataTransformerService);
  });

  describe('getFeatureFlags', () => {
    it('returns all flags from the repository', async () => {
      mockFeatureFlagsRepository.getAll.mockResolvedValue([flag]);
      mockDataTransformerService.transformMultiToData.mockReturnValue([transformedFlag]);

      const actualResult = await featureFlagsService.getFeatureFlags();
      const expectedResult = [transformedFlag];

      expect(mockFeatureFlagsRepository.getAll).toHaveBeenCalled();
      expect(mockDataTransformerService.transformMultiToData).toHaveBeenCalledWith([flag]);
      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('getFeatureFlagByKey', () => {
    it('returns the flag when it exists', async () => {
      mockFeatureFlagsRepository.getByKey.mockResolvedValue(flag);
      mockDataTransformerService.transformOneToData.mockReturnValue(transformedFlag);

      const actualResult = await featureFlagsService.getFeatureFlagByKey(flag.key);
      const expectedResult = transformedFlag;

      expect(mockFeatureFlagsRepository.getByKey).toHaveBeenCalledWith(flag.key);
      expect(mockDataTransformerService.transformOneToData).toHaveBeenCalledWith(flag);
      expect(actualResult).toEqual(expectedResult);
    });

    it('throws FeatureFlagNotFoundError when the flag does not exist', async () => {
      mockFeatureFlagsRepository.getByKey.mockResolvedValue(null);

      await expect(featureFlagsService.getFeatureFlagByKey('missing')).rejects.toThrow(FeatureFlagNotFoundError);
    });
  });

  describe('createFeatureFlag', () => {
    it('creates and returns the flag', async () => {
      mockFeatureFlagsRepository.create.mockResolvedValue(flag);
      mockDataTransformerService.transformOneToData.mockReturnValue(transformedFlag);

      const actualResult = await featureFlagsService.createFeatureFlag({ key: flag.key, isEnabled: true });
      const expectedResult = transformedFlag;

      expect(mockDataTransformerService.transformOneToData).toHaveBeenCalledWith(flag);
      expect(actualResult).toEqual(expectedResult);
    });

    it('propagates FeatureFlagAlreadyExistsError', async () => {
      mockFeatureFlagsRepository.create.mockRejectedValue(new FeatureFlagAlreadyExistsError(flag.key));

      await expect(featureFlagsService.createFeatureFlag({ key: flag.key })).rejects.toThrow(
        FeatureFlagAlreadyExistsError,
      );
    });
  });

  describe('updateFeatureFlag', () => {
    it('returns the updated flag', async () => {
      const updated = { ...flag, is_enabled: false };
      const transformedUpdated: FeatureFlag = { ...transformedFlag, isEnabled: false };
      mockFeatureFlagsRepository.updateByKey.mockResolvedValue(updated);
      mockDataTransformerService.transformOneToData.mockReturnValue(transformedUpdated);

      const actualResult = await featureFlagsService.updateFeatureFlag({
        key: flag.key,
        data: { isEnabled: false },
      });
      const expectedResult = transformedUpdated;

      expect(mockDataTransformerService.transformOneToData).toHaveBeenCalledWith(updated);
      expect(actualResult).toEqual(expectedResult);
    });

    it('throws FeatureFlagNotFoundError when the flag does not exist', async () => {
      mockFeatureFlagsRepository.updateByKey.mockResolvedValue(null);

      await expect(
        featureFlagsService.updateFeatureFlag({ key: 'missing', data: { isEnabled: true } }),
      ).rejects.toThrow(FeatureFlagNotFoundError);
    });
  });

  describe('deleteFeatureFlag', () => {
    it('returns true when the flag is deleted', async () => {
      mockFeatureFlagsRepository.deleteByKey.mockResolvedValue(true);

      const actualResult = await featureFlagsService.deleteFeatureFlagByKey(flag.key);
      const expectedResult = true;

      expect(actualResult).toEqual(expectedResult);
    });

    it('throws FeatureFlagNotFoundError when the flag does not exist', async () => {
      mockFeatureFlagsRepository.deleteByKey.mockResolvedValue(false);

      await expect(featureFlagsService.deleteFeatureFlagByKey('missing')).rejects.toThrow(FeatureFlagNotFoundError);
    });
  });

  describe('evaluateFeatureFlags', () => {
    it('maps enabled known keys to true and omits unknown keys', async () => {
      mockFeatureFlagsRepository.getByKeys.mockResolvedValue([flag]);

      const actualResult = await featureFlagsService.evaluateFeatureFlags([flag.key, 'unknown-flag']);
      const expectedResult = {
        featureFlags: {
          'new-onboarding-flow': true,
        },
      };

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
