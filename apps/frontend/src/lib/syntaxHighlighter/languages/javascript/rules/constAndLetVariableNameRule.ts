import { IDENT_RE } from '../constants';

const CONST_AND_LET_VARIABLE_NAME_RULE = {
  begin: /(?<=\b(const|let)\b\s+\{?\s*)/,
  end: /[;}=]/,
  returnEnd: false,
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
    // Catches "const aaa = 5" as well as "const {a,b,c} = props"
    {
      scope: 'title.variable',
      begin: IDENT_RE,
    },
  ],
};

export { CONST_AND_LET_VARIABLE_NAME_RULE };
