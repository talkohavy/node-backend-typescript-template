import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { logger } from '../configurations';
import { BadRequestError } from '../lib/Errors';

export function joiQueryMiddleware(validationSchema: Joi.ObjectSchema<any>): any {
  return function validateUsingJoi(req: Request, _res: Response, next: NextFunction) {
    const { query } = req;

    const { error } = validationSchema.validate(query);

    if (error) {
      logger.log('Validation error', error);
      throw new BadRequestError(error.message);
    }

    next();
  };
}
