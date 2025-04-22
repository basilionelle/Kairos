/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove output: 'standalone' to work with Netlify's Next.js plugin
  // Ensure trailing slashes for consistent routing
  trailingSlash: true,
};

module.exports = nextConfig;
