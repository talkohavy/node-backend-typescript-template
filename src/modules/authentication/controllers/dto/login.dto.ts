import joi from 'joi';
import { REGEX } from '../../../../common/constants';

export const loginUserSchema = joi
  .object({
    email: joi.string().email().required().messages({
      'string.email': 'Invalid credentials',
      'string.empty': 'Invalid credentials',
      'any.required': 'Invalid credentials',
    }),
    password: joi.string().pattern(REGEX.password).required().messages({
      'string.min': 'Invalid credentials1',
      'string.empty': 'Invalid credentials2',
      'any.required': 'Invalid credentials3',
    }),
    googleId: joi.string().allow(null).pattern(REGEX.sso),
    facebookId: joi.string().allow(null).pattern(REGEX.sso),
  })
  .oxor('googleId', 'facebookId');
