/** @type {import('next').NextConfig} */
const nextConfig = {
  // Railway-optimized config
  experimental: {
    serverComponentsExternalPackages: ['stripe']
  }
}

module.exports = nextConfig 