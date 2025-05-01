export type BaseErrorProps = {
  message?: string;
  name: string;
  /**
   * Override the default status code.
   * The default depends on the error type.
   */
  statusCode: number;
  /**
   * @default false
   */
  shouldReport?: boolean;
};

export type CustomErrorOptions = {
  /**
   * Override the default status code.
   * The default depends on the error type.
   */
  statusCode?: number;
  /**
   * @default false
   */
  shouldReport?: boolean;
};
