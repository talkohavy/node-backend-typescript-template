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
