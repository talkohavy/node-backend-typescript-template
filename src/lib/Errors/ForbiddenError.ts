import { STATUS_CODES } from '../../common/constants';
import { HttpException } from './HttpException';

type ForbiddenErrorOptions = {
  /**
   * @default false
   */
  shouldReport?: boolean;
};

export class ForbiddenError extends HttpException {
  constructor(message?: string, options?: ForbiddenErrorOptions) {
    const { shouldReport } = options ?? {};

    super({
      name: 'ForbiddenError',
      message: message ?? 'Forbidden',
      statusCode: STATUS_CODES.FORBIDDEN,
      shouldReport,
    });
  }
}
