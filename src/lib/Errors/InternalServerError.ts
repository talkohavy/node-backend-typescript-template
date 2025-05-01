import { STATUS_CODES } from '../../common/constants';
import { BaseError } from './BaseError';
import { CustomErrorOptions } from './types';

export class InternalServerError extends BaseError {
  constructor(message?: string, options?: CustomErrorOptions) {
    const { statusCode, shouldReport } = options ?? {};

    super({
      name: 'InternalServerError',
      message: message ?? 'Internal Server Error',
      statusCode: statusCode ?? STATUS_CODES.INTERNAL_ERROR,
      shouldReport,
    });
  }
}
