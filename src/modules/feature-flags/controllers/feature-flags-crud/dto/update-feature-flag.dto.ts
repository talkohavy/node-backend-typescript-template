import Joi from 'joi';

export const updateFeatureFlagSchema = Joi.object({
  isEnabled: Joi.boolean().optional(),
  description: Joi.string().max(1000).allow(null, '').optional(),
}).or('isEnabled', 'description');
