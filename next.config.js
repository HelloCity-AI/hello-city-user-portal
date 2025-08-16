/** @type {import('next').NextConfig} */
const nextConfig = {
  // 设置输出模式为独立模式 方便docker部署
  output: 'standalone',
  
  // 跳过所有检查 之后可能要改回来TAT
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,  
  },
  
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
