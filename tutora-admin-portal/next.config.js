/** @type {import('next').NextConfig} */
const nextConfig = {
  // Railway-optimized config
  experimental: {
    serverComponentsExternalPackages: ['stripe']
  },
  // Disable ESLint during build for faster deployment
  eslint: {
    ignoreDuringBuilds: true
  },
  // Disable TypeScript checking during build for faster deployment
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig 