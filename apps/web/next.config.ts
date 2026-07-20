import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@fad/shared'],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    };
    return config;
  },
};

export default nextConfig;
