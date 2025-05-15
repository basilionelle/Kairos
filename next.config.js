/** @type {import('next').NextConfig} */
// Import the force-rebuild file to ensure Netlify rebuilds the entire site
const forceRebuild = require('./force-rebuild');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Remove output: 'standalone' to work with Netlify's Next.js plugin
  // Ensure trailing slashes for consistent routing
  trailingSlash: true,
  // Add a build ID based on timestamp to force cache invalidation
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

module.exports = nextConfig;
