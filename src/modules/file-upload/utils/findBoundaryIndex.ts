export function findBoundaryIndex(buffer: Buffer, boundary: string, startIndex = 0): number {
  return buffer.indexOf(`--${boundary}`, startIndex);
}
