import pluginJs from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
import pluginCompiler from 'eslint-plugin-react-compiler';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    // when an `ignores` key is used without any other keys in the configuration object, then it acts as global `ignores`.
    ignores: ['dist'],
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'react-compiler/recommended',
    plugins: {
      'react-compiler': pluginCompiler,
      perfectionist,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'all',
          argsIgnorePattern: '(^_|^req$|^res$|^next$)',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: false,
          varsIgnorePattern: '^React$',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-debugger': 'warn',
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
          ignoreCase: true,
          specialCharacters: 'keep',
          internalPattern: ['^~/.+'],
          partitionByComment: false,
          partitionByNewLine: false,
          newlinesBetween: 'never', // <--- 'always' | 'never' | 'ignore'
          maxLineLength: undefined,
          groups: [
            'react',
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          customGroups: {
            value: { react: ['^react$', '^react-.+'] },
            type: { react: ['^react$', '^react-.+'] },
          },
          environment: 'node', // <--- Possible Options: 'node' | 'bun'
        },
      ],
      // 'sort-imports': [ <--- DO NOT ENABLE! Collides with perfectionist/sort-imports
      //   'error',
      //   {
      //     ignoreCase: false,
      //     ignoreDeclarationSort: false,
      //     ignoreMemberSort: false,
      //     memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      //     allowSeparatedGroups: false,
      //   },
      // ],
      // 'sort-keys': ['error', 'asc', { caseSensitive: true, natural: false, minKeys: 2 }], <--- DO NOT ENABLE! Collides with perfectionist/sort-imports
    },
  },
];
