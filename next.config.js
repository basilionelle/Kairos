/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Output static files for better Netlify compatibility
  output: 'export',
  // Disable image optimization since it's not compatible with 'output: export'
  images: { unoptimized: true },
  // Ensure trailing slashes for consistent routing
  trailingSlash: true,
};

module.exports = nextConfig;
