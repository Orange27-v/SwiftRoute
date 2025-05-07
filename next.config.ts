import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // The following are enabled by default with the Vercel CLI, 
  // but can be explicitly set:
  // speedInsights: {
  //   enabled: true, // Or process.env.VERCEL_ENV === 'production'
  // },
  // analytics: {
  //   enabled: true, // Or process.env.VERCEL_ENV === 'production'
  // },
};

export default nextConfig;
