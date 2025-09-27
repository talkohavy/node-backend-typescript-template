import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { logger } from '../configurations';
import { BadRequestError } from '../lib/Errors';

export function joiBodyMiddleware(validationSchema: Joi.ObjectSchema<any>): any {
  return function validateUsingJoi(req: Request, _res: Response, next: NextFunction) {
    const { body } = req;

    const { error } = validationSchema.validate(body);

    if (error) {
      logger.log('Validation error', error);
      throw new BadRequestError(error.message);
    }

    next();
  };
}
