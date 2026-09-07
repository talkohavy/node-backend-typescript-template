import Joi from 'joi';
import { FEATURE_FLAG_KEY_PATTERN } from '../../../logic/constants';

export const createFeatureFlagSchema = Joi.object({
  key: Joi.string().pattern(FEATURE_FLAG_KEY_PATTERN).max(255).required(),
  isEnabled: Joi.boolean().optional(),
  description: Joi.string().max(1000).allow(null, '').optional(),
});
