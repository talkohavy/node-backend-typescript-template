import { STATUS_CODES } from '../../common/constants';
import { HttpException } from './HttpException';

type NotFoundErrorOptions = {
  /**
   * @default false
   */
  shouldReport?: boolean;
};

export class NotFoundError extends HttpException {
  constructor(message?: string, options?: NotFoundErrorOptions) {
    const { shouldReport } = options ?? {};

    super({
      name: 'NotFoundError',
      message: message ?? 'Not Found',
      statusCode: STATUS_CODES.NOT_FOUND,
      shouldReport,
    });
  }
}
