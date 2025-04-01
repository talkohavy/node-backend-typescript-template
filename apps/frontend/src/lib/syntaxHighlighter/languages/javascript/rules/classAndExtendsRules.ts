import { IDENT_RE } from '../constants';

// ES6 classes
function getClassAndExtendsRule(hljs) {
  const { regex } = hljs;

  return {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          IDENT_RE,
          /\s+/,
          /extends/,
          /\s+/,
          regex.concat(IDENT_RE, '(', regex.concat(/\./, IDENT_RE), ')*'),
        ],
        scope: {
          1: 'keyword2',
          3: 'title.class',
          5: 'keyword',
          7: 'title.class.inherited',
        },
      },
      // class Car
      {
        match: [/class/, /\s+/, IDENT_RE],
        scope: {
          1: 'keyword2',
          3: 'title.class',
        },
      },
    ],
  };
}

export { getClassAndExtendsRule };
