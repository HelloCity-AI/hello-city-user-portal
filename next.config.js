/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    // swcPlugins: [['@lingui/swc-plugin', {}]],
  },
  // AWS Amplify动态APP_BASE_URL配置
  // 优先级: 手动配置(自定义域名) > Amplify自动生成 > 本地默认值
  env: {
    APP_BASE_URL:
      process.env.APP_BASE_URL ||
      (process.env.AWS_APP_ID
        ? `https://${process.env.AWS_BRANCH}.${process.env.AWS_APP_ID}.amplifyapp.com`
        : 'http://localhost:3000'),
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
