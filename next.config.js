/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        // Bu modüllerin tarayıcıda olmadığını Next.js'e söylüyoruz (Client-side polyfills)
        fs: false,
        path: false,
        os: false,
        assert: false,
        buffer: false,
        stream: false,
        util: false,
        crypto: false,
        process: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
