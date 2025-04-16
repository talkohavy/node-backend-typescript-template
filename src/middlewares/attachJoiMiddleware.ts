import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { STATUS_CODES } from '../common/constants';
import { logger } from '../lib/logger';

export function attachJoiMiddleware(validationSchema: Joi.ObjectSchema<any>): any {
  return (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    const { error } = validationSchema.validate(body);

    logger.log('Validation error', error);

    if (error) return res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });

    next();
  };
}
