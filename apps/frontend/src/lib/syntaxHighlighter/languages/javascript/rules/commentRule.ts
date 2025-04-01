import { IDENT_RE } from '../constants';

function getCommentRule(hljs) {
  const JSDOC_COMMENT = hljs.COMMENT(/\/\*\*(?!\/)/, '\\*/', {
    relevance: 0,
    contains: [
      {
        begin: '(?=@[A-Za-z]+)',
        relevance: 0,
        contains: [
          {
            scope: 'doctag',
            begin: '@[A-Za-z]+',
          },
          {
            scope: 'curly-brace',
            begin: '[{}]+',
          },
          {
            scope: 'type',
            begin: '(?<={+)',
            end: '(?=}+)',
            excludeEnd: true,
            excludeBegin: true,
            relevance: 0,
          },
          {
            scope: 'variable',
            begin: `${IDENT_RE}(?=\\s*(-)|$)`,
            endsParent: true,
            relevance: 0,
          },
          // eat spaces (not newlines) so we can find
          // types or variables
          {
            begin: /(?=[^\n])\s/,
            relevance: 0,
          },
        ],
      },
    ],
  });

  return {
    scope: 'comment',
    /**
     * Variant 1: C_LINE_COMMENT_MODE
     * - This is for comments starting with 2 forward slashes.
     *
     * Variant 2: JSDOC_COMMENT
     * - NOTE!! MUST come before C_BLOCK_COMMENT_MODE! Otherwise parser is mistaken!
     * - This is for comments starting like /** *\/.
     *
     * Variant 3: C_BLOCK_COMMENT_MODE
     * - This is for comments starting like /* *\/.
     */
    variants: [hljs.C_LINE_COMMENT_MODE, JSDOC_COMMENT, hljs.C_BLOCK_COMMENT_MODE],
  };
}

export { getCommentRule };
