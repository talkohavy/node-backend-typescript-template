import { decimalDigits, decimalInteger, fraction } from '../constants';

const NUMBER_RULE = {
  scope: 'number',
  variants: [
    // DecimalLiteral
    {
      begin: `(\\b(${decimalInteger})((${fraction})|\\.)?|(${fraction}))` + `[eE][+-]?(${decimalDigits})\\b`,
    },
    { begin: `\\b(${decimalInteger})\\b((${fraction})\\b|\\.)?|(${fraction})\\b` },

    // DecimalBigIntegerLiteral
    { begin: '\\b(0|[1-9](_?[0-9])*)n\\b' },

    // NonDecimalIntegerLiteral
    { begin: '\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b' },
    { begin: '\\b0[bB][0-1](_?[0-1])*n?\\b' },
    { begin: '\\b0[oO][0-7](_?[0-7])*n?\\b' },

    // LegacyOctalIntegerLiteral (does not include underscore separators)
    // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
    { begin: '\\b0[0-7]+n?\\b' },
  ],
  relevance: 0,
};

export { NUMBER_RULE };
