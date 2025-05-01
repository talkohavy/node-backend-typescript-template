import { STATUS_CODES } from '../../common/constants';
import { BaseError } from './BaseError';
import { CustomErrorOptions } from './types';

export class UnauthorizedError extends BaseError {
  constructor(message?: string, options?: CustomErrorOptions) {
    const { statusCode, shouldReport } = options ?? {};

    super({
      name: 'UnauthorizedError',
      message: message ?? 'Unauthorized',
      statusCode: statusCode ?? STATUS_CODES.UNAUTHORIZED,
      shouldReport,
    });
  }
}
