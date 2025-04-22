/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Use standalone output for Netlify
  output: 'standalone',
  // Ensure trailing slashes for consistent routing
  trailingSlash: true,
};

module.exports = nextConfig;
