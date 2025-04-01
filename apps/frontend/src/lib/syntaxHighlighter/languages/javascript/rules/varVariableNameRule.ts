import { IDENT_RE } from '../constants';

const VAR_VARIABLE_NAME_RULE = {
  scope: 'oops-you-made-a-mistake-1',
  begin: /(?<=\bvar\b\s+\{?\s*)/,
  end: /[;}=]/,
  contains: [
    {
      begin: /\{/,
      end: /(?=.)/,
      scope: 'curly-brace',
    },
    {
      begin: /\}/,
      end: /(?=.)/,
      scope: 'curly-brace',
    },
    {
      begin: IDENT_RE,
      relevance: 0,
      scope: 'var-variable-name',
    },
  ],
};

export { VAR_VARIABLE_NAME_RULE };
