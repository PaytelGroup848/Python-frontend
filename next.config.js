/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Production deployments should rely on separate CI lint checks
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Strictly enforce 100% type safety during production builds
    ignoreBuildErrors: false,
  },
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;

