/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8082',
        pathname: '/**',
      },

      // Production (VM External IP)
      {
        protocol: 'http',
        hostname: '34.42.94.254',
        port: '8082', // IMPORTANT if images come from backend
        pathname: '/**',
      },
    ],
  },

  // App is served under sub-path
  basePath: '/RideXtra',
  assetPrefix: '/RideXtra/',
};

export default nextConfig;
