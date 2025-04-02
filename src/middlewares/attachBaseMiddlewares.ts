import compression from 'compression';
import cors from 'cors';
import express, { type Express } from 'express';
import { EnvOptions } from '../common/constants.js';
import { handleCors } from '../common/utils/handleCors.js';
import { attachHelmetMiddleware } from './attachHelmetMiddleware.js';

type AttachBaseMiddlewaresProps = {
  app: Express;
  bodySizeLimit?: string;
};

export function attachBaseMiddlewares(props: AttachBaseMiddlewaresProps) {
  const { app, bodySizeLimit = '10mb' } = props;

  app.disable('x-powered-by');
  app.set('etag', false);

  attachHelmetMiddleware({ app });

  app.use(express.json({ limit: bodySizeLimit }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(
    compression({
      filter: (req, _res) => {
        if (req.path === '/sse') return false;

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
