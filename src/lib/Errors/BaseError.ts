import { BaseErrorProps } from './types';

export class BaseError extends Error {
  public readonly isCustomError: boolean = true;
  public readonly shouldReport?: boolean;
  public statusCode: number;

  constructor(props: BaseErrorProps) {
    const { message = 'Something went wrong', name, statusCode, shouldReport = false } = props;

    super(message);

    this.name = name || 'BaseError';
    this.statusCode = statusCode;
    this.shouldReport = shouldReport;

    Object.defineProperty(this, 'name', { enumerable: true });
    Object.defineProperty(this, 'message', { enumerable: true, value: message });
    Object.defineProperty(this, 'stack', { enumerable: true });
  }
}
