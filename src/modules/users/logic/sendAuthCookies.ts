import { CookieOptions, Response } from 'express';
import { Config } from '../../../configurations/types';
import { configService } from '../../../lib/config/config.service';
import { createAccessToken } from './createAccessToken';
import { createRefreshToken } from './createRefreshToken';

type SendAuthCookiesProps = {
  res: Response;
  user: Record<string, any>;
};

export async function sendAuthCookies(props: SendAuthCookiesProps) {
  const { res, user } = props;

  const { authCookie, cookieNames, isCI, isDev } = configService.get<Config>('');
  const { maxAge } = authCookie;
  const { accessTokenCookieName, refreshTokenCookieName } = cookieNames;

  const payload = { userID: user.id, name: user.name, email: user.email };
  const accessToken = await createAccessToken({ payload });
  const refreshToken = await createRefreshToken({ payload });

  const options: CookieOptions = {
    secure: isDev || isCI ? false : true, // <--- A cookie with the Secure attribute is only sent to the server with an encrypted request over the HTTPS protocol. It's never sent with unsecured HTTP
    httpOnly: true, // <--- defaults to `false`. `true` means that client-side scripts (JavaScript) has no access to that cookie.
    domain: isDev || isCI ? undefined : '.luckylove.co.il', // production: '.luckylove.co.il' , development: 'localhost' or ' ' or null
    path: '/', // <--- only if the user on the frontend logs in on this path? i'll send the cookie to him! '/' means any path.
    maxAge,
    sameSite: 'strict', // <--- Options are boolean | 'lax' (default) | 'strict' | 'none'. strict means that only the domain which created the cookie, is the only one who has access to it. lax also allows third-party sites to include our URL and send cookies.
  };

  res.cookie(accessTokenCookieName, accessToken, options);
  res.cookie(refreshTokenCookieName, refreshToken, options);
}
