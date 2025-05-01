import { STATUS_CODES } from '../../common/constants';
import { BaseError } from './BaseError';
import { CustomErrorOptions } from './types';

export class ForbiddenError extends BaseError {
  constructor(message?: string, options?: CustomErrorOptions) {
    const { statusCode, shouldReport } = options ?? {};

    super({
      name: 'ForbiddenError',
      message: message ?? 'Forbidden',
      statusCode: statusCode ?? STATUS_CODES.FORBIDDEN,
      shouldReport,
    });
  }
}
