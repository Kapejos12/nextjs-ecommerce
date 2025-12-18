/** @type {import('next').NextConfig} */
const nextConfig = {
  // Partial Prerendering (PPR) - teraz przez cacheComponents
  cacheComponents: true, // Włącza PPR w Next.js 16
  
  experimental: {
    turbopackFileSystemCacheForDev: true
  },
  
  // Konfiguracja obrazków
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.example.com',
        pathname: '/images/**',
      },
    ],
  },

  // Headers dla bezpieczeństwa
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Redirects (opcjonalnie)
  async redirects() {
    return [
      // Przykład przekierowania
      // {
      //   source: '/old-api/:path*',
      //   destination: '/api/:path*',
      //   permanent: true,
      // },
    ];
  },

  // Rewrites dla proxy API (opcjonalnie)
  async rewrites() {
    return [
      // Przykład proxy
      // {
      //   source: '/external-api/:path*',
      //   destination: 'https://api.example.com/:path*',
      // },
    ];
  },
};

module.exports = nextConfig;