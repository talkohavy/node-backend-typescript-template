import { CookiesConfig } from '../../../../configurations/types';
import { configService } from '../../../../lib/config/config.service';
import { GetUserIfExistsProps } from './interfaces/base.interface';

export abstract class BaseController {
  protected constructor() {}

  /**
   * Helper method to check if user is authenticated and return user information
   * @param headers - Request headers
   * @returns User headers and decoded token if authenticated, empty objects if not
   */
  protected async getUserIfExists(props: GetUserIfExistsProps) {
    const { headers, authService, shouldThrow = true } = props;

    const { accessCookie } = configService.get<CookiesConfig>('cookies');
    const { name: accessTokenCookieName } = accessCookie;

    if (!headers.cookie?.includes(`${accessTokenCookieName}=`)) {
      return { userHeaders: {}, decodedToken: null };
    }

    try {
      const decodedToken = await authService.verifyToken(headers);
      const userHeaders = splitUserToHeaders(decodedToken);

      return { userHeaders, decodedToken };
    } catch (error: any) {
      if (shouldThrow) throw error;

      return { userHeaders: {}, decodedToken: null };
    }
  }
}
