import { Application, NextFunction, Request, Response } from 'express';
import { HEADERS } from '../../common/constants';
import { ConfigService } from '../config/config.service';
import { CallContextService } from './call-context.service';
import { CONTEXT_KEYS } from './logic/constants';

export class CallContextMiddleware {
  public constructor(
    private readonly callContextService: CallContextService<string, string>,
    private readonly configService: ConfigService,
  ) {}

  public use(app: Application, excludedPaths: Array<string> = []): void {
    app.use((req: Request, res: Response, next: NextFunction): void => {
      if (excludedPaths.includes(req.path)) return void next();

      if (req.originalUrl.includes('favicon.ico')) return void res.status(204).end();

      const { method, query, url, originalUrl, path } = req;

      this.callContextService.register();
      const requestId = req.headers[HEADERS.RequestId] as string;

      if (!requestId) throw new Error(`Missing ${CONTEXT_KEYS.RequestId} header`);

      this.callContextService.set(CONTEXT_KEYS.RequestId, requestId);
      this.callContextService.set(CONTEXT_KEYS.Method, method);
      this.callContextService.set(CONTEXT_KEYS.OriginalUrl, originalUrl);
      this.callContextService.set(CONTEXT_KEYS.Url, url);
      this.callContextService.set(CONTEXT_KEYS.Path, path);
      this.callContextService.set(CONTEXT_KEYS.Query, JSON.stringify(query));

      const { accessTokenCookieName } = this.configService.get('cookieNames');

      this.callContextService.set(
        CONTEXT_KEYS.CookieHeaderValue,
        [`${accessTokenCookieName}=${req.cookies[accessTokenCookieName]}`].join(';'),
      );

      next();
    });
  }
}
