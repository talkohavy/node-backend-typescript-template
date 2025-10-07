import compression from 'compression';
import { EXCLUDED_PATHS } from '../common/constants';

export const compressionMiddleware = compression({
  filter: (req, _res) => {
    if (EXCLUDED_PATHS.includes(req.path)) return false;

    return true;
  },
});
