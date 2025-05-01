import { Application, Request, Response } from 'express';
import { COLORS } from '../common/colors';
import { STATUS_CODES } from '../common/constants';

type AttachErrorMiddlewaresProps = {
  app: Application;
};

export function attachErrorMiddlewares(props: AttachErrorMiddlewaresProps) {
  const { app } = props;

  process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection', { err });
    console.error('Should not get here!  You are missing a try/catch somewhere.');
  });

  process.on('uncaughtException', (err) => {
    console.error('uncaughtException', { err });
    console.error('Should not get here! You are missing a try/catch somewhere.');
  });

  app.use(pathNotFoundMiddleware);
  app.use(globalErrorMiddleware);
}

function pathNotFoundMiddleware(req: Request, _res: Response, next: any) {
  console.error('req.originalUrl is:', req.originalUrl);
  console.error('req.path is:', req.path);
  console.error('req.url is:', req.url);
  console.error('req.body is:', req.body);
  console.error('req.params is:', req.params);
  next();
}

function globalErrorMiddleware(error: any, _req: Request, res: Response, _next: any) {
  const data = error.message;
  console.error(COLORS.red, '▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼', COLORS.stop);
  console.error(error);
  console.error(COLORS.red, '▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲', COLORS.stop);

  // if (condition) logger.error(error.message); // <--- store the error if <condition>...

  if (error.isCustomError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(STATUS_CODES.INTERNAL_ERROR).json(data);
}
