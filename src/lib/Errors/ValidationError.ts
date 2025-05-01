import { STATUS_CODES } from '../../common/constants';
import { BaseError } from './BaseError';
import { CustomErrorOptions } from './types';

export class ValidationError extends BaseError {
  constructor(message?: string, options?: CustomErrorOptions) {
    const { statusCode, shouldReport } = options ?? {};

    super({
      name: 'ValidationError',
      message: message ?? 'Bad Request',
      statusCode: statusCode ?? STATUS_CODES.BAD_REQUEST,
      shouldReport,
    });
  }
}
