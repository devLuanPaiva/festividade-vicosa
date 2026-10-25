import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
