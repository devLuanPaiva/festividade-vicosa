import type { NextConfig } from 'next';

const LAN_DEV_ORIGINS = ['192.168.*.*', '10.*.*.*', '172.*.*.*'];

const nextConfig: NextConfig = {
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
      { protocol: 'https', hostname: 'cdn.jocevs.com.br' },
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
