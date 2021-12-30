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
    path: ''
  },
  cloudflareConfig: {
    imageWorkerURL: 'https://blog-image-renderer.pdvil.workers.dev'
  }
}
