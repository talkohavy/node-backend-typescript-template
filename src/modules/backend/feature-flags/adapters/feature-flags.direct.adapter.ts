import type {
  CreateFeatureFlagData,
  EvaluateFeatureFlagsResult,
  FeatureFlag,
  UpdateFeatureFlagByKeyProps,
} from '../../../feature-flags';
import type { FeatureFlagsService } from '../../../feature-flags/services/feature-flags';
import type { IFeatureFlagsAdapter } from './feature-flags.adapter.interface';

export class FeatureFlagsDirectAdapter implements IFeatureFlagsAdapter {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  async createFeatureFlag(data: CreateFeatureFlagData): Promise<FeatureFlag> {
    const featureFlag = await this.featureFlagsService.createFeatureFlag(data);

    return featureFlag;
  }

  async getFeatureFlags(): Promise<Array<FeatureFlag>> {
    const featureFlags = await this.featureFlagsService.getFeatureFlags();

    return featureFlags;
  }

  async getFeatureFlagByKey(key: string): Promise<FeatureFlag> {
    const featureFlag = await this.featureFlagsService.getFeatureFlagByKey(key);

    return featureFlag;
  }

  async updateFeatureFlag(props: UpdateFeatureFlagByKeyProps): Promise<FeatureFlag> {
    const featureFlag = await this.featureFlagsService.updateFeatureFlag(props);

    return featureFlag;
  }

  async deleteFeatureFlagByKey(key: string): Promise<{ success: boolean }> {
    await this.featureFlagsService.deleteFeatureFlagByKey(key);

    const result = { success: true };

    return result;
  }

  async evaluateFeatureFlags(keys: Array<string>): Promise<EvaluateFeatureFlagsResult> {
    const result = await this.featureFlagsService.evaluateFeatureFlags(keys);

    return result;
  }
}
