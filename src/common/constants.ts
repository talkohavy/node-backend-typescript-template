export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export const Environment = {
  Prod: 'prod',
  Dev: 'dev',
} as const;

export type EnvironmentValues = (typeof Environment)[keyof typeof Environment];

export const HEADERS = {
  RequestId: 'x-request-id',
};

export const REGEX = {
  alphaNumeric: /^[a-zA-Z0-9_]+$/,
  containsWhitespace: /\s/,
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  integerNumbers: /^\d+$/,
  nickname: /^[0-9_a-zA-Zא-ת*-]{1,30}$/,
  password: /^[a-zA-Z0-9!@#$%^&*()\-=]{1,20}$/,
  startsOrEndsWithWhitespace: /(?=(^\s|\s{2,}$))/,
  sso: /^[a-zA-Z0-9]{3,30}$/,
  partiallyValidCreditCard: /^(?!.*\s{2})([0-9][0-9\s]*)?$/,
};
