export function extractBoundary(contentType: string): string | null {
  const parts = contentType.split('boundary=');
  return parts[1] || null;
}
