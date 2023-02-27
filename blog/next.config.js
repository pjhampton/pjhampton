module.exports = {
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
  images: {
    loader: 'imgix',
    path: 'https://',
    domains: [
      'localhost',
      'user-images.githubusercontent.com'
    ]
  },
  serverRuntimeConfig: {
    cloudflareWorkerURL: 'https://blog-image-renderer.pdvil.workers.dev'
  }
}
