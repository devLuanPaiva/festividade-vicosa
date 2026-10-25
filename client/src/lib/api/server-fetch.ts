import { getApiBaseUrl } from '@/lib/config/server-env';
import { toApiError, type ApiPage, type ApiResult } from './api-response';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
}

function buildHeaders({ body, token }: RequestOptions): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function serializeBody(body: unknown): BodyInit | undefined {
  if (body === undefined || body instanceof FormData) {
    return body;
  }
  return JSON.stringify(body);
}

async function requestJson(path: string, options: RequestOptions): Promise<unknown> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: options.method ?? 'GET',
    headers: buildHeaders(options),
    body: serializeBody(options.body),
    cache: options.token ? 'no-store' : undefined,
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw toApiError(response.status, body);
  }
  return body;
}

export async function fetchApiResult<T>(path: string, token?: string): Promise<T> {
  const body = (await requestJson(path, { token })) as ApiResult<T>;
  return body.result;
}

export async function fetchApiPage<T>(path: string, token?: string): Promise<T[]> {
  const body = (await requestJson(path, { token })) as ApiPage<T>;
  return body.results;
}

export async function sendApiRequest<T>(path: string, options: RequestOptions): Promise<T> {
  const body = (await requestJson(path, options)) as ApiResult<T>;
  return body.result;
}

export async function sendApiPageRequest<T>(path: string, options: RequestOptions): Promise<T[]> {
  const body = (await requestJson(path, options)) as ApiPage<T>;
  return body.results;
}

export async function sendApiCommand(path: string, options: RequestOptions): Promise<void> {
  await requestJson(path, options);
}
