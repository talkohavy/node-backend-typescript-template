import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(), // <--- from Joi documentation
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{1,30}$')).required(), // <--- from Joi documentation
});
