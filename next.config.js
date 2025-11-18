/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      'replicate', 
      'firebase', 
      'firebase/auth', 
      'firebase/firestore',
      '@firebase/auth', 
      '@firebase/firestore',
    ],
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, 
        path: false,
        os: false,
        assert: false,
        buffer: false,
        stream: false,
        util: false,
        crypto: false,
        process: false,
        url: false,
        tty: false,
        http: false,
        https: false,
        zlib: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
