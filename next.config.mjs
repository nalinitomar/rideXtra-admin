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
        hostname: '34.46.179.143',
        port: '3030', // IMPORTANT if images come from backend
        pathname: '/**',
      },
    ],
  },

  // // App is served under sub-path
  // basePath: '/RideXtra',
  // assetPrefix: '/RideXtra/',
};

export default nextConfig;
