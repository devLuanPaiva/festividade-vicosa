import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';

const ORIGIN = 'https://jocevs.com.br';
const WORKER_URL = pathToFileURL(join(process.cwd(), 'public', 'sw.js')).href;
let loadCount = 0;

interface FakeResponse {
  ok: boolean;
  body: string;
  clone: () => FakeResponse;
}

interface FakeRequest {
  method: string;
  mode: string;
  url: string;
}

type Listener = (event: {
  request?: FakeRequest;
  waitUntil?: (work: Promise<unknown>) => void;
  respondWith?: (response: Promise<FakeResponse>) => void;
}) => void;

function response(body: string, ok = true): FakeResponse {
  const created: FakeResponse = { ok, body, clone: () => created };
  return created;
}

function request(path: string, overrides: Partial<FakeRequest> = {}): FakeRequest {
  return { method: 'GET', mode: 'cors', url: `${ORIGIN}${path}`, ...overrides };
}

interface RunningWorker {
  fetchFromNetwork: ReturnType<typeof vi.fn>;
  cached: Map<string, FakeResponse>;
  handle: (incoming: FakeRequest) => Promise<FakeResponse> | null;
  install: () => Promise<unknown>;
}

async function startWorker(
  fetchImplementation: (request: FakeRequest) => Promise<FakeResponse>,
): Promise<RunningWorker> {
  const listeners = new Map<string, Listener>();
  const cached = new Map<string, FakeResponse>();
  const fetchFromNetwork = vi.fn(fetchImplementation);
  const fakeCaches = {
    open: () =>
      Promise.resolve({
        put: (key: FakeRequest, value: FakeResponse) => {
          cached.set(key.url, value);
          return Promise.resolve();
        },
        addAll: (paths: string[]) => {
          paths.forEach((path) => cached.set(`${ORIGIN}${path}`, response(`precached ${path}`)));
          return Promise.resolve();
        },
      }),
    match: (key: FakeRequest | string) =>
      Promise.resolve(cached.get(typeof key === 'string' ? `${ORIGIN}${key}` : key.url)),
    keys: () => Promise.resolve(['jocevs-static-v1']),
    delete: () => Promise.resolve(true),
  };
  const fakeSelf = {
    location: { origin: ORIGIN },
    skipWaiting: () => Promise.resolve(),
    clients: { claim: () => Promise.resolve() },
    addEventListener: (name: string, listener: Listener) => listeners.set(name, listener),
  };
  vi.stubGlobal('self', fakeSelf);
  vi.stubGlobal('caches', fakeCaches);
  vi.stubGlobal('fetch', fetchFromNetwork);
  loadCount += 1;
  await import(`${WORKER_URL}?load=${loadCount}`);
  return {
    fetchFromNetwork,
    cached,
    handle: (incoming) => {
      let answer: Promise<FakeResponse> | null = null;
      listeners.get('fetch')?.({
        request: incoming,
        respondWith: (value) => {
          answer = value;
        },
      });
      return answer;
    },
    install: () => {
      let work: Promise<unknown> = Promise.resolve();
      listeners.get('install')?.({ waitUntil: (value) => (work = value) });
      return work;
    },
  };
}

describe('service worker', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('never keeps a page: every visit asks the network, so a score is never stale', async () => {
    const { handle, cached } = await startWorker(() => Promise.resolve(response('placar 2x1')));

    const first = await handle(request('/jogos/1', { mode: 'navigate' }));
    const second = await handle(request('/jogos/1', { mode: 'navigate' }));

    expect([first?.body, second?.body]).toEqual(['placar 2x1', 'placar 2x1']);
    expect([...cached.keys()]).not.toContain(`${ORIGIN}/jogos/1`);
  });

  it('shows the offline page when a visit fails for lack of internet', async () => {
    const { handle, install } = await startWorker(() => Promise.reject(new Error('offline')));
    await install();

    const shown = await handle(request('/jogos/1', { mode: 'navigate' }));

    expect(shown?.body).toBe('precached /offline.html');
  });

  it('serves the hashed build files from the cache after the first download', async () => {
    const { handle, fetchFromNetwork } = await startWorker(() =>
      Promise.resolve(response('codigo')),
    );

    await handle(request('/_next/static/chunks/app.js'));
    const again = await handle(request('/_next/static/chunks/app.js'));

    expect(again?.body).toBe('codigo');
    expect(fetchFromNetwork).toHaveBeenCalledTimes(1);
  });

  it('shows the cached brand image at once and refreshes it in the background', async () => {
    let version = 'antiga';
    const { handle, fetchFromNetwork } = await startWorker(() =>
      Promise.resolve(response(version)),
    );

    await handle(request('/brand/bg-sky-mobile.webp'));
    version = 'nova';
    const shown = await handle(request('/brand/bg-sky-mobile.webp'));

    expect(shown?.body).toBe('antiga');
    expect(fetchFromNetwork).toHaveBeenCalledTimes(2);
  });

  it.each([
    ['a write', request('/admin/partidas', { method: 'POST' })],
    ['a data request of the page', request('/jogos?_rsc=abc')],
    [
      'a file from another site',
      { ...request('/foto.webp'), url: 'https://cdn.jocevs.com.br/foto.webp' },
    ],
  ])('leaves %s alone', async (_name, incoming) => {
    const { handle } = await startWorker(() => Promise.resolve(response('x')));

    expect(handle(incoming)).toBeNull();
  });
});
