import type { HttpMethod } from '../types';

type HttpErrorConstructorProps = {
  status: number;
  url: string;
  method: HttpMethod;
  requestBody: any;
  requestHeaders: any;
  responseHeaders: any;
  requestId: string;
  type: string;
};

export class HttpError extends Error {
  status: number;
  url: string;
  method: HttpMethod;
  requestBody: any;
  requestHeaders: any;
  responseHeaders: any;
  requestId: string;
  type: string;

  constructor(props: HttpErrorConstructorProps) {
    super();

    const { status, url, method, requestBody, requestHeaders, responseHeaders, requestId, type } = props;

    this.status = status;
    this.url = url;
    this.method = method;
    this.requestBody = requestBody;
    this.requestHeaders = requestHeaders;
    this.responseHeaders = responseHeaders;
    this.requestId = requestId;
    this.type = type;
  }
}
