import { STATUS_CODES } from '../../common/constants';
import { HttpException } from './HttpException';

type UnauthorizedErrorOptions = {
  /**
   * @default false
   */
  shouldReport?: boolean;
};

export class UnauthorizedError extends HttpException {
  constructor(message?: string, options?: UnauthorizedErrorOptions) {
    const { shouldReport } = options ?? {};

    super({
      name: 'UnauthorizedError',
      message: message ?? 'Unauthorized',
      statusCode: STATUS_CODES.UNAUTHORIZED,
      shouldReport,
    });
  }
}
