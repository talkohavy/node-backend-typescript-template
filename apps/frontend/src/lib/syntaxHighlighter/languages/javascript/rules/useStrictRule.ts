const USE_STRICT_RULE = {
  label: 'use_strict',
  scope: 'meta',
  relevance: 10,
  begin: /^\s*['"]use (strict|asm)['"]/,
};

export { USE_STRICT_RULE };
