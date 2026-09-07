import { FeatureFlagFields } from './feature-flag.fields';

export const sensitiveFields: Array<string> = [];

export const nonSensitiveFields = [
  FeatureFlagFields.id,
  FeatureFlagFields.key,
  FeatureFlagFields.isEnabled,
  FeatureFlagFields.description,
  FeatureFlagFields.createdAt,
  FeatureFlagFields.updatedAt,
];
