// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

const config = {
  useTabs: false,
  tabWidth: 2, // <--- indent tab is 2 spaces worth
  trailingComma: 'all', // <--- Options are: all | es5 | none. Should it add trailing commas on last items? es5 is just for Object keys & Array members. All is also for function parameters.
  semi: true, // <--- prints semi-colons at the ends of statements
  singleQuote: true, // <--- turns this " into '
  jsxSingleQuote: true, // <--- turns this " into ' in JSX
  bracketSameLine: false, // <--- This is for an HTML file. if true, puts the closing of an opening tag on the last line instead of on a new line.
  bracketSpacing: true, // turns this {foo: bar} into this { foo: bar }
  arrowParens: 'always', // WARNING!!! Leave it on "always"! turns this x => x into this (x) => x. This rule MUST stay on "always"! Otherwise it would collide with the "prefer-arrow-callback" & "arrow-body-style" combo from eslint.
  endOfLine: 'auto',
  printWidth: 120, // <--- must match the value stated in eslint config. Defaults to 80.
  proseWrap: 'preserve', // <--- This is relevant for markdown file. "always" creates a line break when line exceeds the amount of allowed characters. "preserve" wraps the text, but remembers that it's a single line. "never" keeps that text in a single line and doesn't wrap at all; text will be kept as a very long one-liner.
  htmlWhitespaceSensitivity: 'css',
  embeddedLanguageFormatting: 'off',
  quoteProps: 'as-needed', // only add quotes around object properties where required
  overrides: [
    {
      files: ['*.mts', '*.cts', '*.ts', '*.d.ts', '*.js', '*.jsx'],
      options: { parser: 'typescript' },
    },
    {
      files: ['*.json'],
      options: { parser: 'json' },
    },
  ],
};

export default config;
