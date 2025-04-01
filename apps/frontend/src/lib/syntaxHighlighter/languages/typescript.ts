/*
Language: TypeScript
Author: Tal Kohavy <talkohavy@gmail.com>
Description: TypeScript is a strict superset of JavaScript
Website: https://www.typescriptlang.org
Category: common, scripting
*/

import { javascriptLanguageToRegister as javascript } from './javascript';
import { IDENT_RE, KEYWORDS as JAVASCRIPT_KEYWORDS } from './javascript/constants';

export function typescriptLanguageToRegister(hljs: any) {
  const tsLanguage = javascript(hljs);

  const TYPES = ['any', 'void', 'number', 'boolean', 'string', 'object', 'never', 'symbol', 'bigint', 'unknown'];

  const NAMESPACE = {
    begin: [/namespace/, /\s+/, hljs.IDENT_RE],
    beginScope: {
      1: 'keyword2',
      3: 'title.class',
    },
  };

  const INTERFACE = {
    beginKeywords: 'interface',
    end: /\{/,
    excludeEnd: true,
    keywords: {
      keyword: 'interface extends',
      built_in: TYPES,
    },
    contains: [],
    // contains: [tsLanguage.exports.CLASS_REFERENCE],
  };

  const USE_STRICT = {
    scope: 'meta',
    relevance: 10,
    begin: /^\s*['"]use strict['"]/,
  };

  const TS_KEYWORDS_GROUP2 = [
    'type',
    'namespace',
    'declare',
    'interface',
    'public',
    'private',
    'protected',
    'implements',
    'declare',
    'abstract',
    'readonly',
    'enum',
    'override',
  ];

  /*
    namespace is a TS keyword but it's fine to use it as a variable name too.
    const message = 'foo';
    const namespace = 'bar';
  */

  const KEYWORDS = {
    ...JAVASCRIPT_KEYWORDS,
    keyword2: JAVASCRIPT_KEYWORDS.keyword2.concat(TS_KEYWORDS_GROUP2),
  };

  const DECORATOR = {
    scope: 'meta',
    begin: `@${IDENT_RE}`,
  };

  const swapMode = (mode: any, label: string, replacement: any) => {
    const indx = mode.contains.findIndex((m: any) => m.label === label);
    if (indx === -1) {
      throw new Error('can not find mode to replace');
    }

    mode.contains.splice(indx, 1, replacement);
  };

  // this should update anywhere keywords is used since
  // it will be the same actual JS object
  Object.assign(tsLanguage.keywords, KEYWORDS);

  // tsLanguage.exports.PARAMS_CONTAINS.push(DECORATOR);

  // highlight the function params
  // const ATTRIBUTE_HIGHLIGHT = tsLanguage.contains.find((c) => c.className === 'attr');
  // tsLanguage.exports.PARAMS_CONTAINS.push([
  //   tsLanguage.exports.CLASS_REFERENCE, // class reference for highlighting the params types
  //   ATTRIBUTE_HIGHLIGHT, // highlight the params key
  // ]);

  tsLanguage.contains = tsLanguage.contains.concat([DECORATOR, NAMESPACE, INTERFACE]);

  // TS gets a simpler shebang rule than JS
  swapMode(tsLanguage, 'shebang', hljs.SHEBANG());

  // JS use strict rule purposely excludes `asm` which makes no sense
  swapMode(tsLanguage, 'use_strict', USE_STRICT);

  // const functionDeclaration = tsLanguage.contains.find((m) => m.label === 'func.def');
  // functionDeclaration.relevance = 0; // () => {} is more typical in TypeScript

  Object.assign(tsLanguage, {
    name: 'TypeScript',
    aliases: ['ts', 'tsx', 'mts', 'cts'],
  });

  return tsLanguage;
}
