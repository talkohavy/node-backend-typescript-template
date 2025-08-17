import { IncomingHttpHeaders } from 'http';

export type GetUserIfExistsProps = {
  headers: IncomingHttpHeaders;
  authService: any;
  /**
   * @default true
   */
  shouldThrow?: boolean;
};
