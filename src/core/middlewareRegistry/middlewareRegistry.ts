import { Application } from 'express';
import { postUseMiddleware } from '../../common/utils/postUseMiddleware';
import { preUseMiddleware } from '../../common/utils/preUseMiddleware';
import { CallContextMiddleware } from '../../lib/call-context';
import { attachBaseMiddlewares } from '../../middlewares/attachBaseMiddlewares';
import { attachErrorMiddlewares } from '../../middlewares/attachErrorMiddlewares';
import { attachRequestIdMiddleware } from '../../middlewares/attachRequestIdMiddleware';
import { callContextService } from '../initCallContextService';

export class MiddlewareRegistry {
  usePreMiddlewares(app: Application): void {
    const callContextMiddleware = new CallContextMiddleware(callContextService);

    attachRequestIdMiddleware(app);
    attachBaseMiddlewares(app);

    callContextMiddleware.use(app, preUseMiddleware, postUseMiddleware);
  }

  usePostMiddlewares(app: Application): void {
    attachErrorMiddlewares(app);
  }
}
