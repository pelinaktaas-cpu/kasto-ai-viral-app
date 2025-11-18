/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bu ayar, Next.js'in external kütüphanelerle derleme yapmasını sağlar.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        'fs': false,
        'path': false,
        'os': false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
