import { POSTGRES_UNIQUE_VIOLATION } from '@src/databases/postgres/models/feature-flag';

export function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;

  if (!('code' in error)) return false;

  return error.code === POSTGRES_UNIQUE_VIOLATION;
}
