import type { Application, Request, Response } from 'express';
import { StatusCodes } from '../common/constants';

export function errorHandlerPlugin(app: Application) {
  app.use(globalErrorMiddleware);
}

function globalErrorMiddleware(error: any, _req: Request, res: Response, _next: any) {
  console.error('▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼');
  console.error(error);
  console.error('▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲');

  // if (condition) logger.error(error.message); // <--- store the error if <condition>...

  const data = {
    statusCode: error.statusCode ?? StatusCodes.INTERNAL_ERROR,
    message: error.message,
  };

  res.status(data.statusCode).json(data);
}
