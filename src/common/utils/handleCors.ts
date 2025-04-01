import { EnvOptions } from '../constants.js';

const ALLOWED_DOMAINS = ['http://localhost:3000', 'https://luckylove.co.il'];
const DOMAIN_REGEX = '.luckylove.co.il';

export function handleCors(nodeEnv: EnvOptions): any {
  return (origin: string, callback: (err: Error | null, origin?: any) => void) => {
    const isAllowed =
      origin === undefined ||
      ALLOWED_DOMAINS.includes(origin) ||
      (nodeEnv !== EnvOptions.Prod && origin.endsWith(DOMAIN_REGEX));

    if (isAllowed) return void callback(null, true);

    callback(new Error('CORS Not allowed'), false);
  };
}
