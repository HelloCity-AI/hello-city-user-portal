/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // swcPlugins: [['@lingui/swc-plugin', {}]],
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
