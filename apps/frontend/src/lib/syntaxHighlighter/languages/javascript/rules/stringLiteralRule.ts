import { SUBST } from '../constants';

function getStringLiteralRule(hljs) {
  return {
    scope: 'string',
    begin: '`',
    end: '`',
    contains: [hljs.BACKSLASH_ESCAPE, SUBST],
  };
}

export { getStringLiteralRule };
