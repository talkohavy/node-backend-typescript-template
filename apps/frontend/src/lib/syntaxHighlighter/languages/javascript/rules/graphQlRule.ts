import { SUBST } from '../constants';

function getGraphQlRule(hljs) {
  return {
    begin: '.?gql`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [hljs.BACKSLASH_ESCAPE, SUBST],
      subLanguage: 'graphql',
    },
  };
}

export { getGraphQlRule };
