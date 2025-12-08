import cookieParser from 'cookie-parser';
import express, { type Application } from 'express';
import { EXCLUDED_PATHS } from '../../common/constants';
import { postUseMiddleware } from '../../common/utils/postUseMiddleware';
import { preUseMiddleware } from '../../common/utils/preUseMiddleware';
import { CallContextMiddleware, type CallContextService } from '../../lib/call-context';
import { attachHelmetMiddleware } from '../../middlewares/attachHelmetMiddleware';
import { compressionMiddleware } from '../../middlewares/compression.middleware';
import { corsMiddleware } from '../../middlewares/cors.middleware';
import { requestIdMiddleware } from '../../middlewares/request-id.middleware';

export class MiddlewareRegistry {
  constructor(private readonly callContextService: CallContextService<string, string>) {}

  usePreMiddlewares(app: Application): void {
    const callContextMiddleware = new CallContextMiddleware(this.callContextService);

    app.use(requestIdMiddleware);

    app.disable('x-powered-by');
    // app.set('etag', false);

    attachHelmetMiddleware(app);

    app.use((req, res, next) => {
      if (EXCLUDED_PATHS.includes(req.path)) return next();

      express.json({ limit: '10mb' })(req, res, next);
    });

    app.use((req, res, next) => {
      if (EXCLUDED_PATHS.includes(req.path)) return next();

      express.urlencoded({ extended: true, limit: '1mb' })(req, res, next);
    });

    app.use(cookieParser()); // <--- MUST come before authentication middleware!

    app.use(compressionMiddleware);

    app.use(corsMiddleware);

    callContextMiddleware.use(app, preUseMiddleware, postUseMiddleware);
  }
}
