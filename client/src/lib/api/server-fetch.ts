import { getApiBaseUrl } from '@/lib/config/server-env';
import { toApiError, type ApiPage, type ApiResult } from './api-response';

async function requestJson(path: string): Promise<unknown> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: { Accept: 'application/json' },
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw toApiError(response.status, body);
  }
  return body;
}

export async function fetchApiResult<T>(path: string): Promise<T> {
  const body = (await requestJson(path)) as ApiResult<T>;
  return body.result;
}

export async function fetchApiPage<T>(path: string): Promise<T[]> {
  const body = (await requestJson(path)) as ApiPage<T>;
  return body.results;
}
