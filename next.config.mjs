/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- Uncomment these if you deploy as a static export ---
  // output: 'export',
  // images: { unoptimized: true },

  images: {
    remotePatterns: [
      // DEV API
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8082',
        pathname: '/**',
      },

      // PROD: your real domain (allow both HTTP and HTTPS)
      {
        protocol: 'http',
        hostname: 'mobileappindia.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mobileappindia.com',
        pathname: '/**',
      },
      // (Optional) www host
      {
        protocol: 'http',
        hostname: 'www.mobileappindia.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.mobileappindia.com',
        pathname: '/**',
      },

      // If you use S3 or another CDN, add exact hosts here:
      // { protocol: 'https', hostname: 'your-bucket.s3.amazonaws.com', pathname: '/**' },
      // { protocol: 'https', hostname: 's3.ap-south-1.amazonaws.com', pathname: '/**' },
    ],
  },

  // --- If serving under /rideXtra-admin path (static or SSR behind subdir), uncomment:
  // basePath: '/rideXtra-admin',
  // assetPrefix: '/rideXtra-admin/',
};

export default nextConfig;
