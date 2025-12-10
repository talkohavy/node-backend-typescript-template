interface ParsedHeaders {
  filename?: string;
  contentType?: string;
}

/**
 * Parses the headers section of a multipart part to extract filename and content-type
 */
export function parseMultipartHeaders(headers: string): ParsedHeaders {
  const result: ParsedHeaders = {};

  const contentDispositionMatch = headers.match(/Content-Disposition: form-data;.*filename="([^"]*)"/);
  if (contentDispositionMatch?.[1]) {
    result.filename = contentDispositionMatch[1];
  }

  const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]*)/);
  if (contentTypeMatch?.[1]) {
    result.contentType = contentTypeMatch[1];
  }

  return result;
}
