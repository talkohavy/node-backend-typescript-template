import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { Environment } from '../common/constants';
import { handleCors } from '../common/utils/handleCors';
import { attachHelmetMiddleware } from './attachHelmetMiddleware';

const EXCLUDED_PATHS = ['/health-check'];

type AttachBaseMiddlewaresProps = {
  app: Application;
  bodySizeLimit?: string;
};

export function attachBaseMiddlewares(props: AttachBaseMiddlewaresProps) {
  const { app, bodySizeLimit = '10mb' } = props;

  app.disable('x-powered-by');
  app.set('etag', false);

  attachHelmetMiddleware({ app });

  app.use((req, res, next) => {
    if (EXCLUDED_PATHS.includes(req.path)) return next();

    express.json({ limit: bodySizeLimit })(req, res, next);
  });

  app.use((req, res, next) => {
    if (EXCLUDED_PATHS.includes(req.path)) return next();

    express.urlencoded({ extended: true, limit: '1mb' })(req, res, next);
  });

  app.use(cookieParser()); // <--- MUST come before authentication middleware!

  app.use(
    compression({
      filter: (req, _res) => {
        if (EXCLUDED_PATHS.includes(req.path)) return false;

        return true;
      },
    }),
  );

  app.use(
    cors({
      origin: handleCors(Environment.Dev),
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true, // <--- Important! You'll get CORS Error without it.
    }),
  );
}
