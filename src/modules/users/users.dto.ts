import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().min(1).max(30).required(),
  age: Joi.number().integer().min(0).max(120).optional(),
  email: Joi.string().email().optional(),
});
