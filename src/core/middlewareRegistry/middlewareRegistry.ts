import { Application } from 'express';
import { postUseMiddleware } from '../../common/utils/postUseMiddleware';
import { preUseMiddleware } from '../../common/utils/preUseMiddleware';
import { CallContextMiddleware, CallContextService } from '../../lib/call-context';
import { attachBaseMiddlewares } from '../../middlewares/attachBaseMiddlewares';
import { attachErrorMiddlewares } from '../../middlewares/attachErrorMiddlewares';
import { attachRequestIdMiddleware } from '../../middlewares/attachRequestIdMiddleware';

export class MiddlewareRegistry {
  constructor(private readonly callContextService: CallContextService<string, string>) {}

  usePreMiddlewares(app: Application): void {
    const callContextMiddleware = new CallContextMiddleware(this.callContextService);

    attachRequestIdMiddleware(app);
    attachBaseMiddlewares(app);

    callContextMiddleware.use(app, preUseMiddleware, postUseMiddleware);
  }

  usePostMiddlewares(app: Application): void {
    attachErrorMiddlewares(app);
  }
}
