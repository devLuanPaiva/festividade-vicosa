import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';
import { ResponseInterceptor } from './response.interceptor';

function createContext(query: Record<string, string> = {}): ExecutionContext {
  const request = {
    protocol: 'https',
    path: '/users',
    query,
    get: (name: string): string | undefined => (name === 'host' ? 'api.example.com' : undefined),
  };
  return { switchToHttp: () => ({ getRequest: () => request }) } as unknown as ExecutionContext;
}

function intercept(data: unknown, query?: Record<string, string>): Promise<unknown> {
  const handler: CallHandler = { handle: () => of(data) };
  return firstValueFrom(new ResponseInterceptor().intercept(createContext(query), handler));
}

describe('ResponseInterceptor', () => {
  it('wraps a single value in the success envelope', async () => {
    await expect(intercept({ id: 1 })).resolves.toEqual({ status: 'success', result: { id: 1 } });
  });

  it('keeps an empty result in the success envelope', async () => {
    await expect(intercept(undefined)).resolves.toEqual({ status: 'success', result: undefined });
  });

  it('wraps a list with pagination data and absolute links', async () => {
    const items = Array.from({ length: 5 }, (_, index) => ({ id: index }));

    await expect(intercept(items, { limit: '2', search: 'ana' })).resolves.toMatchObject({
      status: 'success',
      count: 5,
      currentPage: 1,
      totalPages: 3,
      next: 'https://api.example.com/users?limit=2&search=ana&offset=2',
      previous: null,
      results: [{ id: 0 }, { id: 1 }],
    });
  });
});
