import { IDENT_RE } from '../constants';

const FUNCTION_VARIABLE_RULE = {
  match: [
    /const|var|let/,
    /\s+/,
    IDENT_RE,
    /\s*/,
    /=\s*/,
    /((function|async)\s*)?/, // async is optional
    // regex.lookahead(FUNC_LEAD_IN_RE),
  ],
  scope: {
    1: 'keyword2',
    3: 'title.function',
  },
  contains: [],
};

export { FUNCTION_VARIABLE_RULE };
