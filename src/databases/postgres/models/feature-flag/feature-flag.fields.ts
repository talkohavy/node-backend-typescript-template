export const FeatureFlagFields = {
  id: 'id',
  key: 'key',
  isEnabled: 'is_enabled',
  description: 'description',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
} as const;

export type FeatureFlagFieldValues = (typeof FeatureFlagFields)[keyof typeof FeatureFlagFields];
