import Joi from 'joi';

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid credentials',
    'string.empty': 'Invalid credentials',
    'any.required': 'Invalid credentials',
  }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{1,30}$/)
    .required()
    .messages({
      'string.min': 'Invalid credentials1',
      'string.empty': 'Invalid credentials2',
      'any.required': 'Invalid credentials3',
    }),
});
