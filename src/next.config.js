/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Allow local images
    unoptimized: false,
  },
  // Enable static exports if needed
  output: 'standalone',
}

module.exports = nextConfig