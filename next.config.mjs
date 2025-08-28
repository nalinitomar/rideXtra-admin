/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8082',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'your-production-domain.com', // change to your real domain
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com', // if using AWS S3
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
