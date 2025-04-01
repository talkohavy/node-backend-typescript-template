import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginCompiler from 'eslint-plugin-react-compiler';

export default [
  {
    // when an `ignores` key is used without any other keys in the configuration object, then it acts as global `ignores`.
    ignores: ['dist'],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'react-compiler/recommended',
    plugins: {
      'react-compiler': pluginCompiler,
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
    },
  },
];
