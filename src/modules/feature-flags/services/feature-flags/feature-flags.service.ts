import { FeatureFlagNotFoundError } from '../../logic/errors';
import type { FeatureFlagsRepository } from '../../repositories/feature-flags';
import type { FeatureFlag } from '../../types';
import type { DataTransformerService } from '../data-transformer';
import type { CreateFeatureFlagData, EvaluateFeatureFlagsResult, UpdateFeatureFlagByKeyProps } from './types';

export class FeatureFlagsService {
  constructor(
    private readonly featureFlagsRepository: FeatureFlagsRepository,
    private readonly dataTransformerService: DataTransformerService,
  ) {}

  async createFeatureFlag(data: CreateFeatureFlagData): Promise<FeatureFlag> {
    const featureFlagRaw = await this.featureFlagsRepository.create(data);

    const featureFlag = this.dataTransformerService.transformOneToData(featureFlagRaw);

    return featureFlag;
  }

  async getFeatureFlags(): Promise<Array<FeatureFlag>> {
    const featureFlagsRaw = await this.featureFlagsRepository.getAll();

    const featureFlags = this.dataTransformerService.transformMultiToData(featureFlagsRaw);

    return featureFlags;
  }

  async getFeatureFlagByKey(key: string): Promise<FeatureFlag> {
    const featureFlagRaw = await this.featureFlagsRepository.getByKey(key);

    if (!featureFlagRaw) throw new FeatureFlagNotFoundError(key);

    const featureFlag = this.dataTransformerService.transformOneToData(featureFlagRaw);

    return featureFlag;
  }

  async updateFeatureFlag(props: UpdateFeatureFlagByKeyProps): Promise<FeatureFlag> {
    const { key, data } = props;

    const featureFlagRaw = await this.featureFlagsRepository.updateByKey({ key, data });

    if (!featureFlagRaw) throw new FeatureFlagNotFoundError(key);

    const featureFlag = this.dataTransformerService.transformOneToData(featureFlagRaw);

    return featureFlag;
  }

  async deleteFeatureFlagByKey(key: string): Promise<boolean> {
    const deleted = await this.featureFlagsRepository.deleteByKey(key);

    if (!deleted) throw new FeatureFlagNotFoundError(key);

    return true;
  }

  async evaluateFeatureFlags(keys: Array<string>): Promise<EvaluateFeatureFlagsResult> {
    const featureFlagsDb = await this.featureFlagsRepository.getByKeys(keys);

    const enabledByKey = new Map(featureFlagsDb.map((featureFlag) => [featureFlag.key, featureFlag.is_enabled]));

    const featureFlags: Record<string, boolean> = {};

    keys.forEach((key) => {
      if (enabledByKey.get(key)) {
        featureFlags[key] = true;
      }
    });

    const result: EvaluateFeatureFlagsResult = { featureFlags };

    return result;
  }
}
