module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: `${process.env.PROD_SERVER_URL}/api/:slug*` // Proxy to Backend
      }
    ]
  }
}