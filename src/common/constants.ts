import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from '../lib/Errors';
import { HttpException } from '../lib/Errors/HttpException';

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

type StatusCodesType = typeof StatusCodes;
export type StatusCodeKeys = keyof StatusCodesType;
export type StatusCodeValues = StatusCodesType[StatusCodeKeys];

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
