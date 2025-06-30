/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify optimization with Next.js Runtime support
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
  // Netlify Next.js Runtime optimizations
  ...(process.env.NETLIFY && {
    // Enable standalone output for better performance on Netlify
    distDir: '.next',
  }),
  // Development headers (Netlify handles production headers)
  ...(process.env.NODE_ENV !== 'production' ? {
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
  } : {}),
}

module.exports = nextConfig