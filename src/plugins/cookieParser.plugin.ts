import cookieParser from 'cookie-parser';

export function cookieParserPlugin(app: any) {
  app.use(cookieParser());
}
