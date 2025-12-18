import Joi from 'joi';

export const updateBookSchema = Joi.object({
  name: Joi.string().min(1).max(40),
  author: Joi.string(),
  publishedYear: Joi.number().integer().min(1900).max(2023),
});
