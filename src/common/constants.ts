import type { HttpException } from '../lib/Errors/HttpException';
import type { OptimizedModules } from './types';
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from '../lib/Errors';

export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;

type TypeOfStatusCodes = typeof StatusCodes;
export type StatusCodeKeys = keyof TypeOfStatusCodes;
export type StatusCodeValues = TypeOfStatusCodes[StatusCodeKeys];

export const StatusCodeToError: Partial<Record<StatusCodeValues, new (...args: any[]) => HttpException>> = {
  [StatusCodes.BAD_REQUEST]: BadRequestError,
  [StatusCodes.UNAUTHORIZED]: UnauthorizedError,
  [StatusCodes.FORBIDDEN]: ForbiddenError,
  [StatusCodes.NOT_FOUND]: NotFoundError,
  [StatusCodes.INTERNAL_ERROR]: InternalServerError,
} as const;

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export type HttpMethodValues = (typeof HttpMethod)[keyof typeof HttpMethod];

export const ServiceNames = {
  Users: 'users',
  Chats: 'chats',
  Auth: 'auth',
} as const;

type ServiceNamesType = typeof ServiceNames;
export type ServiceNameKeys = keyof ServiceNamesType;
export type ServiceNameValues = ServiceNamesType[ServiceNameKeys];

export const Environment = {
  Prod: 'prod',
  Dev: 'dev',
} as const;

type TypeOfEnvironment = typeof Environment;
export type EnvironmentKeys = keyof TypeOfEnvironment;
export type EnvironmentValues = TypeOfEnvironment[EnvironmentKeys];

export const HEADERS = {
  RequestId: 'x-request-id',
};

export const API_URLS = {
  healthCheck: '/api/health-check',
  swagger: '/api/docs',
  // authentication
  auth: '/api/auth',
  authLogin: '/api/auth/login',
  authLogout: '/api/auth/logout',
  createTokens: '/api/auth/tokens',
  verifyToken: '/api/auth/verify-token',
  isPasswordValid: '/api/auth/is-password-valid',
  // users
  users: '/api/users',
  userById: '/api/users/:userId',
  getProfile: '/api/users/get-profile',
  getUserByEmail: '/api/users/get-by-email',
  // books
  books: '/api/books',
  bookById: '/api/books/:bookId',
  // transactions
  transactions: '/api/transactions',
  uploadTransactionFile: '/api/transactions/upload-file',
  // backend
  backendMiddleware: '/api/backend',
};

/**
 * Paths that should be excluded from certain middlewares
 */
export const EXCLUDED_PATHS = [API_URLS.healthCheck];

export const optimizedModules: OptimizedModules = {
  modules: {
    AuthenticationModule: {
      getAuthenticationService: null as any,
    },
    UsersModule: {
      usersCrudService: null as any,
      userUtilitiesService: null as any,
    },
    HealthCheckModule: null as any,
  },
};
