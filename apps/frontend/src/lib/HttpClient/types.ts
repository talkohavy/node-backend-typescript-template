export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum HttpHeaders {
  REQUEST_ID = 'x-request-id',
  BROWSER_ID = 'x-browser-id',
  TAB_ID = 'x-tab-id',
}

export type FetchOptions = {
  body?: any;
  headers?: Record<string, string | number | boolean>;
};

export type ExecuteProps = {
  url: string;
  method: HttpMethod;
} & FetchOptions;

export type HttpResponse<T = any> = {
  response: T;
  requestId: string;
};
