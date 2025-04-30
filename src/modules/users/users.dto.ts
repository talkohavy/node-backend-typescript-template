import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(), // <--- from Joi documentation
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{1,30}$')).required(), // <--- from Joi documentation
  name: Joi.string().min(3).max(30).optional(),
  age: Joi.number().integer().min(0).max(120).optional(),
  // repeatPassword: Joi.ref('password'), // <--- from Joi documentation
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(1).max(30).optional(),
  age: Joi.number().integer().min(0).max(120).optional(),
  email: Joi.string().email().optional(),
})
  .or('name', 'age', 'email')
  .required();

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid credentials',
    'string.empty': 'Invalid credentials',
    'any.required': 'Invalid credentials',
  }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{1,30}$')).required().messages({
    'string.min': 'Invalid credentials1',
    'string.empty': 'Invalid credentials2',
    'any.required': 'Invalid credentials3',
  }),
});
