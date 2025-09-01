/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Hydration hatalarını önlemek için
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  // Client-side rendering için
  reactStrictMode: false,
}

module.exports = nextConfig
