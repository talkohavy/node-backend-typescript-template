import { SUBST } from '../constants';

function getHtmlRule(hljs) {
  return {
    begin: '.?html`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [hljs.BACKSLASH_ESCAPE, SUBST],
      subLanguage: 'xml',
    },
  };
}

export { getHtmlRule };
