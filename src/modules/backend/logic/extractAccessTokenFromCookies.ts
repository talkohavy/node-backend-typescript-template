import type { CookiesConfig } from '../../../configurations';
import { configService } from '../../../core';

export function extractAccessTokenFromCookies(cookies: any): string {
  const { accessCookie } = configService.get<CookiesConfig>('cookies');
  const token = cookies[accessCookie.name] as string;

  return token;
}
