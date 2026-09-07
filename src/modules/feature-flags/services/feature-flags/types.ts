type FeatureFlagData = {
  isEnabled?: boolean;
  description?: string | null;
};

export type CreateFeatureFlagData = {
  key: string;
  isEnabled?: boolean;
  description?: string | null;
};

export type UpdateFeatureFlagByKeyProps = {
  key: string;
  data: FeatureFlagData;
};

export type EvaluateFeatureFlagsResult = {
  featureFlags: Record<string, boolean>;
};
