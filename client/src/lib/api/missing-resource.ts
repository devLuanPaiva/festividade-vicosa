import { notFound } from 'next/navigation';
import { ApiError } from './api-response';

const NOT_FOUND_STATUS = 404;
const BAD_REQUEST_STATUS = 400;

function isMissingResource(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.statusCode === NOT_FOUND_STATUS || error.statusCode === BAD_REQUEST_STATUS)
  );
}

export async function orNotFound<T>(loading: Promise<T>): Promise<T> {
  try {
    return await loading;
  } catch (error) {
    if (isMissingResource(error)) {
      notFound();
    }
    throw error;
  }
}
