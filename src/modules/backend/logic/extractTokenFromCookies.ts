import { configService, type CookiesConfig } from '../../../configurations';

export function extractTokenFromCookies(cookies: any): string {
  const { accessCookie } = configService.get<CookiesConfig>('cookies');
  const token = cookies[accessCookie.name] as string;

  return token;
}
