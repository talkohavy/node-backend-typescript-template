import { IncomingHttpHeaders } from 'http';
import { AuthenticationNetworkService } from '../../../services/authentication-network.service';

export type GetUserIfExistsProps = {
  headers: IncomingHttpHeaders;
  authService: AuthenticationNetworkService;
  /**
   * @default true
   */
  shouldThrow?: boolean;
};
