import { STATUS_CODES } from '../../common/constants';
import { BaseError } from './BaseError';
import { CustomErrorOptions } from './types';

export class NotFoundError extends BaseError {
  constructor(message?: string, options?: CustomErrorOptions) {
    const { statusCode, shouldReport } = options ?? {};

    super({
      name: 'NotFoundError',
      message: message ?? 'Not Found',
      statusCode: statusCode ?? STATUS_CODES.NOT_FOUND,
      shouldReport,
    });
  }
}
