import Joi from 'joi';

export const createBookSchema = Joi.object({
  name: Joi.string().min(1).max(40).required(),
  author: Joi.string().required(),
  publishedYear: Joi.number().integer().min(1900).max(2023).required(),
});
