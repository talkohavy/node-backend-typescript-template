import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import { EnvOptions } from '../common/constants.js';
import { handleCors } from '../common/utils/handleCors.js';
import { attachHelmetMiddleware } from './attachHelmetMiddleware.js';

const EXCLUDED_PATHS = ['/health-check'];
const EXCLUDED_PATHS_FOR_COMPRESSION = ['/sse', '/health-check'];

type AttachBaseMiddlewaresProps = {
  app: Express;
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
        if (EXCLUDED_PATHS_FOR_COMPRESSION.includes(req.path)) return false;

        return true;
      },
    }),
  );

  app.use(
    cors({
      origin: handleCors(EnvOptions.Dev),
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true, // <--- Important! You'll get CORS Error without it.
    }),
  );
}
