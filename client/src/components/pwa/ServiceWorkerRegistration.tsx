'use client';

import { useEffect } from 'react';

const SERVICE_WORKER_URL = '/sw.js';

function keepSiteWorkingWithoutServiceWorker(): void {
  return undefined;
}

export function ServiceWorkerRegistration(): null {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) {
      return;
    }
    navigator.serviceWorker
      .register(SERVICE_WORKER_URL, { scope: '/', updateViaCache: 'none' })
      .catch(keepSiteWorkingWithoutServiceWorker);
  }, []);
  return null;
}
