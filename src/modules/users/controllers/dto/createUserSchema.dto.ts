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
