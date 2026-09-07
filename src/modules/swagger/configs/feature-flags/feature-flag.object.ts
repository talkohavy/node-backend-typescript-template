export const FeatureFlagObject = {
  type: 'object',
  required: ['id', 'key', 'isEnabled', 'createdAt', 'updatedAt'],
  properties: {
    id: { type: 'integer', format: 'int64', example: 1 },
    key: { type: 'string', example: 'new-onboarding-flow' },
    isEnabled: { type: 'boolean', example: false },
    description: { type: 'string', example: 'Enables the redesigned onboarding flow for all users', nullable: true },
    createdAt: { type: 'integer', example: 1_700_000_000_000 },
    updatedAt: { type: 'integer', example: 1_700_000_000_000 },
  },
};
