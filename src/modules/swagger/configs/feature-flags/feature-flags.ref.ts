import { EvaluateFeatureFlagsRequestObject, EvaluateFeatureFlagsResponseObject } from './evaluate-feature-flags.object';
import { FeatureFlagObject } from './feature-flag.object';

export const definitions = {
  FeatureFlag: FeatureFlagObject,
  EvaluateFeatureFlagsRequest: EvaluateFeatureFlagsRequestObject,
  EvaluateFeatureFlagsResponse: EvaluateFeatureFlagsResponseObject,
};

export const FEATURE_FLAG_REFS = {
  featureFlag: '#/components/schemas/FeatureFlag',
  evaluateFeatureFlagsRequest: '#/components/schemas/EvaluateFeatureFlagsRequest',
  evaluateFeatureFlagsResponse: '#/components/schemas/EvaluateFeatureFlagsResponse',
};
