/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. External paketleri sunucu bileşenleri için etkinleştiriyoruz (Firebase/Replicate için kritik)
  experimental: {
    serverComponentsExternalPackages: ['replicate', 'firebase'],
  },
  
  // 2. Webpack ayarları: Derleme sırasında Node.js modüllerini görmezden gelmeyi zorluyoruz.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        // Tüm olası Node.js modüllerini tarayıcı tarafında devre dışı bırakıyoruz.
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
        // undici/firebase hatalarını çözer
        'undici/lib/web/fetch/util.js': false, 
      };
    }
    return config;
  },
}

module.exports = nextConfig
