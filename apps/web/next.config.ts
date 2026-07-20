import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@fad/shared',
    '@fad/data',
    '@fad/ledger',
    '@fad/sim-engine',
    '@fad/narrative',
    '@fad/domain',
    '@fad/monte-carlo',
  ],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    };
    return config;
  },
};

export default nextConfig;
