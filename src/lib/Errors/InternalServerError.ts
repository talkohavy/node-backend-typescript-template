import { STATUS_CODES } from '../../common/constants';
import { HttpException } from './HttpException';

type InternalServerErrorOptions = {
  /**
   * @default false
   */
  shouldReport?: boolean;
};

export class InternalServerError extends HttpException {
  constructor(message?: string, options?: InternalServerErrorOptions) {
    const { shouldReport } = options ?? {};

    super({
      name: InternalServerError.name,
      message: message ?? 'Internal Server Error',
      statusCode: STATUS_CODES.INTERNAL_ERROR,
      shouldReport,
    });
  }
}
