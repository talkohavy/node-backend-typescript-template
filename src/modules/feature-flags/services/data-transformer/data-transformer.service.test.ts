import { DataTransformerService } from './data-transformer.service';
import type { FeatureFlagDB } from '../../repositories/feature-flags';
import type { FeatureFlag } from '../../types';

describe('DataTransformerService', () => {
  let dataTransformerService: DataTransformerService;

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
    dataTransformerService = new DataTransformerService();
  });

  describe('transformOneToData', () => {
    it('maps a full DB row to domain data', () => {
      const actualResult = dataTransformerService.transformOneToData(flag);
      const expectedResult = transformedFlag;

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('transformMultiToData', () => {
    it('maps each DB row to domain data', () => {
      const actualResult = dataTransformerService.transformMultiToData([flag]);
      const expectedResult = [transformedFlag];

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('transformCreateToDB', () => {
    it('applies defaults for omitted optional fields', () => {
      const actualResult = dataTransformerService.transformCreateToDB({ key: flag.key });
      const expectedResult = {
        key: flag.key,
        is_enabled: false,
        description: null,
      };

      expect(actualResult).toEqual(expectedResult);
    });

    it('maps present optional fields to DB columns', () => {
      const actualResult = dataTransformerService.transformCreateToDB({
        key: flag.key,
        isEnabled: true,
        description: flag.description,
      });
      const expectedResult = {
        key: flag.key,
        is_enabled: true,
        description: flag.description,
      };

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('transformUpdateToDB', () => {
    it('maps only the fields that were provided', () => {
      const actualResult = dataTransformerService.transformUpdateToDB({ isEnabled: false });
      const expectedResult = { is_enabled: false };

      expect(actualResult).toEqual(expectedResult);
    });

    it('maps both fields when both are provided', () => {
      const actualResult = dataTransformerService.transformUpdateToDB({
        isEnabled: true,
        description: flag.description,
      });
      const expectedResult = {
        is_enabled: true,
        description: flag.description,
      };

      expect(actualResult).toEqual(expectedResult);
    });

    it('maps a null description to the DB column', () => {
      const actualResult = dataTransformerService.transformUpdateToDB({ description: null });
      const expectedResult = { description: null };

      expect(actualResult).toEqual(expectedResult);
    });

    it('returns an empty object when no fields are provided', () => {
      const actualResult = dataTransformerService.transformUpdateToDB({});
      const expectedResult = {};

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
