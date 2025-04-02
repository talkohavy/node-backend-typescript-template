import express from 'express';
import { attachBaseMiddlewares } from '../middlewares/attachBaseMiddlewares.js';
import { attachErrorMiddlewares } from '../middlewares/attachErrorMiddlewares.js';
import { attachServerSentEventModule } from '../modules/serverSentEvents/serverSentEvents.module.js';
import { attachHttpRoutes } from '../routes/index.js';

export async function startServer() {
  const app = express();

  attachBaseMiddlewares({ app });

  attachHttpRoutes(app);

  attachServerSentEventModule(app);

  attachErrorMiddlewares({ app });

  app.listen(process.env.BACKEND_PORT, () => console.log(`server started on port ${process.env.BACKEND_PORT}`));
}
