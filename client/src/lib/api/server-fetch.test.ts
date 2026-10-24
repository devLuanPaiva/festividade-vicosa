import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from './api-response';
import { fetchApiPage, fetchApiResult, sendApiRequest } from './server-fetch';

function stubFetch(status: number, body: unknown): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

interface SentRequest {
  method: string;
  body?: string;
  headers: Record<string, string>;
}

function sentRequest(fetchMock: ReturnType<typeof vi.fn>): SentRequest {
  return fetchMock.mock.calls[0]?.[1] as SentRequest;
}

describe('server fetch', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('unwraps the result of a single item response', async () => {
    stubFetch(200, { status: 'success', result: { id: 'a' } });

    await expect(fetchApiResult('/editions/a')).resolves.toEqual({ id: 'a' });
  });

  it('unwraps the results of a paginated response', async () => {
    stubFetch(200, { status: 'success', results: [{ id: 'a' }, { id: 'b' }] });

    await expect(fetchApiPage('/editions')).resolves.toHaveLength(2);
  });

  it('builds the url from the configured base url without a trailing slash', async () => {
    vi.stubEnv('API_BASE_URL', 'https://api.example.com/');
    const fetchMock = stubFetch(200, { status: 'success', result: null });

    await fetchApiResult('/health');

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/health', expect.anything());
  });

  it('throws an ApiError carrying the error details sent by the api', async () => {
    stubFetch(404, {
      status: 'error',
      message: 'Não encontrado',
      data: null,
      errors: { code: 'NOT_FOUND', field: '', detail: 'Edição não encontrada.' },
    });

    await expect(fetchApiResult('/editions/x')).rejects.toMatchObject({
      statusCode: 404,
      details: { code: 'NOT_FOUND' },
    });
    await expect(fetchApiResult('/editions/x')).rejects.toBeInstanceOf(ApiError);
  });

  it('sends the bearer token and the json body on authenticated requests', async () => {
    const fetchMock = stubFetch(200, { status: 'success', result: { id: 'a' } });

    await sendApiRequest('/matches/a/result', {
      method: 'PUT',
      body: { scoreA: 2 },
      token: 'secret-token',
    });

    const request = sentRequest(fetchMock);
    expect(request.method).toBe('PUT');
    expect(request.body).toBe('{"scoreA":2}');
    expect(request.headers.Authorization).toBe('Bearer secret-token');
  });

  it('does not send credentials on public requests', async () => {
    const fetchMock = stubFetch(200, { status: 'success', result: null });

    await fetchApiResult('/health');

    expect(sentRequest(fetchMock).headers).not.toHaveProperty('Authorization');
  });

  it('throws an unexpected-error ApiError when the body is not json', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: () => Promise.reject(new Error('not json')),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchApiResult('/health')).rejects.toMatchObject({
      details: { code: 'UNEXPECTED_ERROR' },
    });
  });
});
