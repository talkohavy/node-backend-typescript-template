import type {
  CreateFeatureFlagData,
  EvaluateFeatureFlagsResult,
  FeatureFlag,
  UpdateFeatureFlagByKeyProps,
} from '../../../feature-flags';

export type IFeatureFlagsAdapter = {
  createFeatureFlag(data: CreateFeatureFlagData): Promise<FeatureFlag>;
  getFeatureFlags(): Promise<Array<FeatureFlag>>;
  getFeatureFlagByKey(key: string): Promise<FeatureFlag>;
  updateFeatureFlag(props: UpdateFeatureFlagByKeyProps): Promise<FeatureFlag>;
  deleteFeatureFlagByKey(key: string): Promise<{ success: boolean }>;
  evaluateFeatureFlags(keys: Array<string>): Promise<EvaluateFeatureFlagsResult>;
};
