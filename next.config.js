/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify optimization
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Production optimizations
  compress: true,
  generateEtags: false,
  // Netlify-specific headers (handled in netlify.toml)
  ...(process.env.NODE_ENV === 'production' ? {} : {
    headers: async () => {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, must-revalidate',
            },
          ],
        },
      ]
    },
  }),
}

module.exports = nextConfig