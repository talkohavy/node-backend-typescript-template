import { CookiesConfig } from '../../../configurations/types';
import { configService } from '../../../lib/config/config.service';

export function extractTokenFromCookies(cookies: any): string {
  const { accessCookie } = configService.get<CookiesConfig>('cookies');
  const token = cookies[accessCookie.name] as string;

  return token;
}
