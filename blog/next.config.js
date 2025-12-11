const defaultConfig = {
  output: 'export',
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    });
    return config;
  },
  images: {
    loader: 'imgix',
    path: 'https://',
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com'
      }
    ]
  },
  productionBrowserSourceMaps: true
};

// https://www.npmjs.com/package/@next/bundle-analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer(defaultConfig);
