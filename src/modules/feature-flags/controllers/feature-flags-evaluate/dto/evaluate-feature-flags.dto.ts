import Joi from 'joi';
import { FEATURE_FLAG_KEY_PATTERN } from '../../../logic/constants';

export const evaluateFeatureFlagsSchema = Joi.object({
  keys: Joi.array().items(Joi.string().pattern(FEATURE_FLAG_KEY_PATTERN).max(255)).min(1).max(100).required(),
});
