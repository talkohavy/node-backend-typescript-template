export const EvaluateFeatureFlagsRequestObject = {
  type: 'object',
  required: ['keys'],
  properties: {
    keys: {
      type: 'array',
      items: { type: 'string' },
      example: ['new-onboarding-flow', 'maintenance-banner'],
    },
  },
};

export const EvaluateFeatureFlagsResponseObject = {
  type: 'object',
  required: ['featureFlags'],
  properties: {
    featureFlags: {
      type: 'object',
      additionalProperties: { type: 'boolean' },
      example: { 'new-onboarding-flow': true },
    },
  },
};
