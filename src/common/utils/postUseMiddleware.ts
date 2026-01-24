import { Context } from '../../lib/logger-service';
import { HEADERS } from '../constants';
import type { CallContextService } from '../../lib/call-context';
import type { Request, Response, NextFunction } from 'express';

export function postUseMiddleware(
  callContextService: CallContextService,
  req: Request,
  _res: Response,
  _next: NextFunction,
) {
  const requestId = req.headers[HEADERS.RequestId] as string;

  callContextService.set(Context.RequestId, requestId);
}
