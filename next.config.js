/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone', // Enable for Docker deployment
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    // swcPlugins: [['@lingui/swc-plugin', {}]],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.po$/,
      use: {
        loader: '@lingui/loader',
      },
    });
    return config;
  },
};

module.exports = nextConfig;
