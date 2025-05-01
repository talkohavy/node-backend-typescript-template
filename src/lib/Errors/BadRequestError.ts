import { STATUS_CODES } from '../../common/constants';
import { BaseError } from './BaseError';
import { CustomErrorOptions } from './types';

export class BadRequestError extends BaseError {
  constructor(message?: string, options?: CustomErrorOptions) {
    const { statusCode, shouldReport } = options ?? {};

    super({
      name: 'BadRequestError',
      message: message ?? 'Bad Request',
      statusCode: statusCode ?? STATUS_CODES.BAD_REQUEST,
      shouldReport,
    });
  }
}
