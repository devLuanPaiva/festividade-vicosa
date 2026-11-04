import type { NextConfig } from 'next';
import type { RemotePattern } from 'next/dist/shared/lib/image-config';

const LAN_DEV_ORIGINS = ['192.168.*.*', '10.*.*.*', '172.*.*.*'];

const DEFAULT_MEDIA_PUBLIC_URL = 'https://cdn.jocevs.com.br';

function mediaRemotePattern(): RemotePattern {
  const { protocol, hostname } = new URL(process.env.MEDIA_PUBLIC_URL || DEFAULT_MEDIA_PUBLIC_URL);
  return { protocol: protocol === 'http:' ? 'http' : 'https', hostname };
}

const SERVICE_WORKER_HEADERS = [
  { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
  { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/sw.js', headers: SERVICE_WORKER_HEADERS }];
  },
  allowedDevOrigins: LAN_DEV_ORIGINS,
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    agentFeedback: true,
    serverActions: { bodySizeLimit: '4mb' },
  },
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'thumb.wikimedia.org' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      mediaRemotePattern(),
    ],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  reactStrictMode: true,
};

export default nextConfig;
