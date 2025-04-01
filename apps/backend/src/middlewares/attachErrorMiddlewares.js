export function attachErrorMiddlewares({ app }) {
  process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection', { err });
    console.error('Should not get here!  You are missing a try/catch somewhere.');
  });

  process.on('uncaughtException', (err) => {
    console.error('uncaughtException', { err });
    console.error('Should not get here! You are missing a try/catch somewhere.');
  });

  app.use(pathNotFoundMiddleware);
  app.use(errorHandlerMiddleware);
}

function pathNotFoundMiddleware(req, res, next) {
  console.error('req.originalUrl is:', req.originalUrl);
  console.error('req.path is:', req.path);
  console.error('req.url is:', req.url);
  console.error('req.body is:', req.body);
  console.error('req.params is:', req.params);
  next();
}

function errorHandlerMiddleware(error, req, res, next) {
  const statusCode = 500;
  const data = error.message;
  console.error('▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼');
  console.error(error);
  console.error('▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲');

  console.log('store the error if <condition>...');

  return res.status(statusCode).json(data);
}
