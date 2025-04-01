/*
Language: JavaScript
Description: JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.
Category: common, scripting, web
Website: https://developer.mozilla.org/en-US/docs/Web/JavaScript
*/

// import * as ECMAScript from '../ecmascript';
import { FRAGMENT, IDENT_RE, KEYWORDS } from './constants';
import { ARRAY_BRACKET_RULE } from './rules/arrayBracketsRule';
import { ARROW_RULE } from './rules/arrowRule';
import { getClassAndExtendsRule } from './rules/classAndExtendsRules';
import { CLASS_CALL_RULE } from './rules/classCallRule';
import { getCommentRule } from './rules/commentRule';
import { CONST_AND_LET_VARIABLE_NAME_RULE } from './rules/constAndLetVariableNameRule';
import { getCssRule } from './rules/cssRule';
import { CURLY_BRACES_RULE } from './rules/curlyBracesRule';
import { getFunctionCallRule } from './rules/functionCallRule';
import { FUNCTION_NAME_RULE } from './rules/functionNameRule';
import { FUNCTION_VARIABLE_RULE } from './rules/functionVariableRule';
import { getGraphQlRule } from './rules/graphQlRule';
import { getHtmlRule } from './rules/htmlRule';
import { NUMBER_RULE } from './rules/numberRule';
import { PARENTHESIS_RULE } from './rules/parenthesisRule';
import { getStringLiteralRule } from './rules/stringLiteralRule';
import { USE_STRICT_RULE } from './rules/useStrictRule';
import { VAR_VARIABLE_NAME_RULE } from './rules/varVariableNameRule';
import { getXmlTagRules } from './rules/xmlTags';

export function javascriptLanguageToRegister(hljs: any) {
  const { regex } = hljs;

  const XML_TAG_RULES = getXmlTagRules();
  const HTML_TEMPLATE_RULE = getHtmlRule(hljs);
  const CSS_TEMPLATE_RULE = getCssRule(hljs);
  const TEMPLATE_STRING = getStringLiteralRule(hljs);
  const COMMENT_RULE = getCommentRule(hljs);
  const CLASS_AND_EXTENDS_RULE = getClassAndExtendsRule(hljs);
  const FUNCTION_CALL_RULE = getFunctionCallRule(hljs);
  const GRAPHQL_TEMPLATE_RULE = getGraphQlRule(hljs);

  const PROPERTY_ACCESS = {
    begin: regex.concat(/\./, regex.lookahead(regex.concat(IDENT_RE, /(?![0-9A-Za-z$_(])/))),
    end: IDENT_RE,
    excludeBegin: true,
    keywords: 'prototype',
    scope: 'property',
    relevance: 0,
  };

  return {
    name: 'JavaScript',
    case_insensitive: false, // <--- JavaScript language is case-sensitive! defaults to `false`.
    aliases: ['js', 'jsx', 'mjs', 'cjs'],
    keywords: KEYWORDS,
    // this will be extended by TypeScript
    exports: {},
    illegal: /#(?![$_A-z])/,
    contains: [
      hljs.SHEBANG({
        label: 'shebang',
        binary: 'node',
        relevance: 5,
      }),
      USE_STRICT_RULE,
      FUNCTION_NAME_RULE,
      FUNCTION_VARIABLE_RULE,
      CONST_AND_LET_VARIABLE_NAME_RULE,
      VAR_VARIABLE_NAME_RULE,
      CURLY_BRACES_RULE,
      PARENTHESIS_RULE,
      ARRAY_BRACKET_RULE,
      CLASS_CALL_RULE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE_RULE,
      CSS_TEMPLATE_RULE,
      COMMENT_RULE,
      NUMBER_RULE,
      FUNCTION_CALL_RULE,
      ARROW_RULE,
      CLASS_AND_EXTENDS_RULE,
      {
        // JSX
        variants: [
          { begin: FRAGMENT.begin, end: FRAGMENT.end },
          // XML_SELF_CLOSING
          { match: /<[A-Za-z0-9\\._:-]+\s*\/>/ },
          {
            begin: XML_TAG_RULES.begin,
            // we carefully check the opening tag to see if it truly
            // is a tag and not a false positive
            'on:begin': XML_TAG_RULES.isTrulyOpeningTag,
            end: XML_TAG_RULES.end,
          },
        ],
        subLanguage: 'xml',
        contains: [
          // React components (starting with Capital letter) need help identifying their closing twin.
          {
            begin: XML_TAG_RULES.begin,
            end: XML_TAG_RULES.end,
            skip: true,
            contains: ['self'],
          },
        ],
      },
      GRAPHQL_TEMPLATE_RULE,
      TEMPLATE_STRING,
      {
        scope: 'attr',
        begin: IDENT_RE + regex.lookahead(':'),
        relevance: 0,
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0,
      },
      PROPERTY_ACCESS,
      {
        match: /\$[(.]/, // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      },
      // The UPPERCASE_CONSTANT_RULE:
      // - Makes JSON appear as white instead of green (which is what VSCode does):
      // {
      //   relevance: 0,
      //   match: /\b[A-Z][A-Z_0-9]+\b/,
      //   scope: 'variable.constant',
      // },
    ],
  };
}
