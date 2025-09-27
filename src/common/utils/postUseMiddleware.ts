import { Request, Response, NextFunction } from 'express';
import { CallContextService } from '../../lib/call-context';
import { Context } from '../../lib/logger-service';
import { HEADERS } from '../constants';

export function postUseMiddleware(
  callContextService: CallContextService,
  req: Request,
  _res: Response,
  _next: NextFunction,
) {
  const requestId = req.headers[HEADERS.RequestId] as string;

  callContextService.set(Context.RequestId, requestId);
}
