import { QueryFailedError } from 'typeorm';

const FOREIGN_KEY_VIOLATION_CODE = '23503';

export function isForeignKeyViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string } | undefined)?.code === FOREIGN_KEY_VIOLATION_CODE
  );
}

export async function runUnlessReferenced(
  operation: () => Promise<unknown>,
  buildReferencedError: () => Error,
): Promise<void> {
  try {
    await operation();
  } catch (error) {
    throw isForeignKeyViolation(error) ? buildReferencedError() : error;
  }
}
