import { LOWERCASED_VARIABLE_RE } from '../constants';

const FUNCTION_LIKE_GLOBALS = [
  'async',
  'super',
  'import',
  'constructor',
  'return',
  'if',
  'for',
  'while',
  'switch',
  'catch',
  'function',
].join('|');

function getFunctionCallRule(hljs) {
  const { regex } = hljs;

  const IGNORE_FUNCTION_LIKE_GLOBALS_RE = `(?<!${FUNCTION_LIKE_GLOBALS})`;
  const WITH_OPEN_PARENTHESIS_UP_AHEAD_RE = /(?=\s*\()/;

  return {
    match: regex.concat(
      /(?<!function\s+)/,
      /\b/,
      LOWERCASED_VARIABLE_RE,
      WITH_OPEN_PARENTHESIS_UP_AHEAD_RE,
      IGNORE_FUNCTION_LIKE_GLOBALS_RE,
    ),
    scope: 'title.function.call',
    relevance: 0,
  };
}

export { getFunctionCallRule };
