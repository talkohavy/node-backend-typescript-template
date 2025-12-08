import compression from 'compression';
import { EXCLUDED_PATHS } from '../common/constants';

export function compressionPlugin(app: any) {
  app.use(compressionMiddleware);
}

function compressionMiddleware() {
  return compression({
    filter: (req, _res) => {
      if (EXCLUDED_PATHS.includes(req.path)) return false;

      return true;
    },
  });
}
