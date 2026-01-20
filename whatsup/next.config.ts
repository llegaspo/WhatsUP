import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    domains: [
      'scontent.fmnl30-2.fna.fbcdn.net',
      'scontent.fmnl30-3.fna.fbcdn.net',
      'scontent.xx.fbcdn.net',
      'scontent.fna.fbcdn.net',
      'scontent.cdninstagram.com', // Just in case
    ],
  },
};

export default nextConfig;