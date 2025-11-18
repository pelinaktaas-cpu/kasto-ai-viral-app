/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bu ayar, Next.js'in external (dış) paketleri derleme sırasında Node.js modülü olarak tanımasını sağlar.
  // Bu, özellikle Firebase ve Replicate kütüphaneleri için kritik öneme sahiptir.
  // "undici/lib/web/fetch/util.js" hatası dahil tüm Node.js modül hatalarını çözer.
  experimental: {
    serverComponentsExternalPackages: ['replicate', 'firebase'],
  },

  // Fallback ayarlarını kaldırıyoruz (çünkü bu yeni ayar hepsini kapsar)
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, 
    };
    return config;
  },
}

module.exports = nextConfig
