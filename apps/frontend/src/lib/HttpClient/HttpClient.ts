import { v4 as uuid } from 'uuid';
import { type ExecuteProps, type FetchOptions, HttpHeaders, HttpMethod, type HttpResponse } from './types';
import { HttpError } from './logic/HttpError';
import { sessionManager } from '../SessionManager';

export let httpClient: HttpClient;

export class HttpClient {
  abortControllers: Map<string, AbortController>;

  constructor(protected _baseUrl?: string) {
    this.abortControllers = new Map();
  }

  set baseUrl(url: string) {
    this.baseUrl = url;
  }

  public get<TResponse = any>(url: string, options?: FetchOptions) {
    return this.execute<TResponse>({ url, method: HttpMethod.GET, ...options });
  }

  public post<TResponse = any>(url: string, options?: FetchOptions) {
    return this.execute<TResponse>({ url, method: HttpMethod.POST, ...options });
  }

  public put<TResponse = any>(url: string, options?: FetchOptions) {
    return this.execute<TResponse>({ url, method: HttpMethod.PUT, ...options });
  }

  public patch<TResponse = any>(url: string, options?: FetchOptions) {
    return this.execute<TResponse>({ url, method: HttpMethod.PATCH, ...options });
  }

  public delete<TResponse = any>(url: string, options?: FetchOptions) {
    return this.execute<TResponse>({ url, method: HttpMethod.DELETE, ...options });
  }

  protected async execute<TResponse = any>(props: ExecuteProps): Promise<HttpResponse<TResponse>> {
    const { url, method, body, headers: additionalHeaders } = props;

    const requestId = uuid();
    const signal = this.addAbortControllerToList(requestId);
    const fullTargetUrl = `${this._baseUrl}/${url}`;
    const { localStorageId, sessionStorageId } = sessionManager.getSessionIds();
    const headers = {
      'Content-Type': 'application/json',
      [HttpHeaders.REQUEST_ID]: requestId,
      [HttpHeaders.BROWSER_ID]: localStorageId,
      [HttpHeaders.TAB_ID]: sessionStorageId,
      ...additionalHeaders,
    };

    try {
      const responseRaw = await fetch(fullTargetUrl, {
        body: JSON.stringify(body),
        headers: headers as HeadersInit,
        method,
        credentials: 'include' as RequestCredentials,
        signal,
      });

      this.removeAbortControllerFromList(requestId);

      const { error, data: response } = await this.parseJsonResponse(responseRaw);

      if (error) {
        throw new HttpError({
          status: responseRaw.status,
          url: responseRaw.url,
          method,
          requestBody: body,
          requestHeaders: headers,
          responseHeaders: responseRaw.headers,
          requestId,
          type: responseRaw.type,
        });
      }

      return { response, requestId };
    } catch (error: any) {
      this.removeAbortControllerFromList(requestId);

      throw error;
    }
  }

  abortRequestById(requestId: string) {
    const controller = this.abortControllers.get(requestId);

    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestId);
    }
  }

  abortAllRequests() {
    for (const controller of this.abortControllers.values()) {
      controller.abort();
    }

    this.abortControllers.clear();
  }

  private async parseJsonResponse(responseRaw: any): Promise<{ data?: any; error?: any }> {
    try {
      if (!responseRaw.ok) return { error: true };

      const response = await responseRaw.json();
      return { data: response };
    } catch (error) {
      return { error };
    }
  }

  private addAbortControllerToList(requestId: string) {
    const abortController = new AbortController();
    this.abortControllers.set(requestId, abortController);

    return abortController.signal;
  }

  private removeAbortControllerFromList(requestId: string) {
    this.abortControllers.delete(requestId);
  }
}

export function initHttpClient(apiGatewayUrl: string) {
  httpClient = new HttpClient(apiGatewayUrl);
}
